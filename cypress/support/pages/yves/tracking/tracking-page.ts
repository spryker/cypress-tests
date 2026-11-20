import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { TrackingRepository } from './tracking-repository';

// gtag.js is loaded from Google; the hits it sends are answered here, so no test data reaches Google Analytics.
const GOOGLE_ANALYTICS_HIT_URL_PATTERN = /google-analytics\.com\/g\/collect/;
const NO_CONTENT_STATUS_CODE = 204;
// A GA4 hit carries one event in its query, or several in its body, one per line.
// gtag puts one event per line into the body of a batched hit.
const HIT_BODY_EVENT_SEPARATOR = /\r?\n/;
const EVENT_NAME_PARAMETER = 'en';
const ITEM_PARAMETER_PATTERN = /^pr\d+$/;
// An item is one parameter of `~`-separated fields, each a two-character name and its value, e.g. `idSKU-1~qt2`.
const ITEM_FIELD_SEPARATOR = '~';
const ITEM_FIELD_NAME_LENGTH = 2;
// GA4 sends the item category levels as `ca` and `c2` to `c5`.
const ITEM_CATEGORY_FIELD_NAMES = ['ca', 'c2', 'c3', 'c4', 'c5'];
// A custom item parameter is a pair of fields: `k<n>` holds its name and `v<n>` its value.
const CUSTOM_ITEM_PARAMETER_NAME_PATTERN = /^k(\d)$/;
const CUSTOM_ITEM_PARAMETER_VALUE_PREFIX = 'v';
// gtag.js defines this global once it has loaded and run.
const GOOGLE_TAG_LOADED_GLOBAL = 'google_tag_manager';
// A cold load of gtag.js from Google, which a slow network or browser can take long for.
const GOOGLE_TAG_LOAD_TIMEOUT = 30000;
// A Back Office configuration change reaches the storefront once the publish and synchronize queues are processed.
const SETTINGS_SYNC_COMMANDS = ['console queue:worker:start --stop-when-empty'];
const SETTINGS_SYNC_RETRIES = 10;
const SETTINGS_SYNC_RETRY_WAIT = 2000;
// The storefront's consent component reads the granted consent purposes from this cookie, comma separated.
const TRACKING_CONSENT_COOKIE_NAME = 'trackingConsent';
const CONSENT_PURPOSE_SEPARATOR = ',';
// A consent management platform dispatches it on the document once it stored the shopper's new consent.
const CONSENT_CHANGE_EVENT = 'traceable-events-consent-change';
// The storefront's item list view tracker writes each card's position in its list here, and a paginated list's first position.
const ITEM_LIST_INDEX_ATTRIBUTE = 'data-item-list-index';
const ITEM_LIST_INDEX_OFFSET_ATTRIBUTE = 'data-item-list-index-offset';
// Dispatched by the storefront's item list view tracker for the products seen, whether or not an adapter sends them.
const ITEM_LIST_VIEW_EVENT = 'item-list-view';

@injectable()
@autoWired
export class TrackingPage extends YvesPage {
  @inject(REPOSITORIES.TrackingRepository) private repository: TrackingRepository;

  protected PAGE_URL = '/';

  // Records every GA4 event sent from now on; the array fills while the test runs.
  recordGoogleAnalyticsTraffic = (): GoogleAnalyticsTraffic => {
    const traffic: GoogleAnalyticsTraffic = { events: [] };

    cy.intercept({ url: GOOGLE_ANALYTICS_HIT_URL_PATTERN }, (request): void => {
      traffic.events.push(...this.getHitEvents(request.url, request.body));
      request.reply(NO_CONTENT_STATUS_CODE);
    });

    return traffic;
  };

  /**
   * Waits until the storefront renders the Google Analytics adapter with the given event switches,
   * e.g. { add_to_cart: true }. The adapter is rendered only while a Measurement ID is configured;
   * the ID itself stays out of the command log.
   */
  waitForEventSettings = (enabledEvents: Record<string, boolean>): void => {
    const eventSelectors = Object.entries(enabledEvents)
      .map(([eventName, isEnabled]): string => `[initial*='"${eventName}":${isEnabled}']`)
      .join('');

    cy.reloadUntilFound(
      this.PAGE_URL,
      `${this.repository.getGoogleAnalyticsAdapterSelector()}[initial*="appId"]${eventSelectors}`,
      'body',
      SETTINGS_SYNC_RETRIES,
      SETTINGS_SYNC_RETRY_WAIT,
      SETTINGS_SYNC_COMMANDS
    );
  };

  /**
   * Waits until the storefront renders the orchestrator with consent required or not,
   * as the Back Office setting says.
   */
  waitForTrackingConsentRequirement = (isConsentRequired: boolean): void => {
    cy.reloadUntilFound(
      this.PAGE_URL,
      `${this.repository.getTrackingOrchestratorSelector()}[consent-required="${isConsentRequired}"]`,
      'body',
      SETTINGS_SYNC_RETRIES,
      SETTINGS_SYNC_RETRY_WAIT,
      SETTINGS_SYNC_COMMANDS
    );
  };

  // Consent stored before the page loads, as a consent management platform keeps it between visits.
  grantTrackingConsent = (purposes: string[]): void => {
    cy.setCookie(TRACKING_CONSENT_COOKIE_NAME, purposes.join(CONSENT_PURPOSE_SEPARATOR));
  };

  // Consent the shopper gives on the open page: stored, then reported the way a consent management platform reports it.
  grantTrackingConsentOnPage = (purposes: string[]): void => {
    this.grantTrackingConsent(purposes);
    this.reportTrackingConsentChange();
  };

  // No consent stored, for the next page that loads.
  removeTrackingConsent = (): void => {
    cy.clearCookie(TRACKING_CONSENT_COOKIE_NAME);
  };

  // Consent the shopper withdraws on the open page: removed, then reported the way a consent management platform reports it.
  withdrawTrackingConsentOnPage = (): void => {
    this.removeTrackingConsent();
    this.reportTrackingConsentChange();
  };

  getGoogleAnalyticsAdapter = (): Cypress.Chainable => cy.get(this.repository.getGoogleAnalyticsAdapterSelector());

  // The adapter waits at most its gtag-event-timeout for Google Analytics to take an event before the page may navigate,
  // so an action taken before gtag.js has loaded can lose its hit. Called on every page before the action under test.
  // Both commands retry until they find what they read: the adapter element, then the global of gtag.js.
  waitForGoogleAnalyticsToLoad = (): void => {
    this.getGoogleAnalyticsAdapter();
    cy.window().its(GOOGLE_TAG_LOADED_GLOBAL, { timeout: GOOGLE_TAG_LOAD_TIMEOUT });
  };

  getGtagScript = (): Cypress.Chainable => cy.get(this.repository.getGtagScriptSelector());

  // Cypress hands a hit body over as text or, depending on how the browser sent it, as bytes; both hold the batched events.
  private getHitBodyText = (body: unknown): string => {
    if (typeof body === 'string') {
      return body;
    }

    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return new TextDecoder().decode(body);
    }

    return '';
  };

  // An event of the page's own window, as the page's listeners expect.
  private reportTrackingConsentChange = (): void => {
    cy.window().then((window: Window & typeof globalThis): void => {
      window.document.dispatchEvent(new window.Event(CONSENT_CHANGE_EVENT));
    });
  };

  // Counts the list views the storefront reports from now on, on every page loaded later; call it before the page is visited.
  recordItemListViews = (): ItemListViews => {
    const itemListViews: ItemListViews = { count: 0 };

    cy.on('window:before:load', (window: Window): void => {
      window.document.addEventListener(ITEM_LIST_VIEW_EVENT, (): void => {
        itemListViews.count += 1;
      });
    });

    return itemListViews;
  };

  visitStorefrontPage = (url: string): void => {
    cy.visit(url);
  };

  // A list is reported once its cards are half visible on the screen.
  scrollToItemList = (itemListIdPrefix: string): void => {
    this.getItemList(itemListIdPrefix).scrollIntoView();
  };

  getItemListIndexOffset = (itemListIdPrefix: string): Cypress.Chainable<number> =>
    this.getItemList(itemListIdPrefix)
      .invoke('attr', ITEM_LIST_INDEX_OFFSET_ATTRIBUTE)
      .then((indexOffset: string | undefined): number => Number(indexOffset));

  // Only a card the tracker has already given its position sends one with the click.
  openFirstItemListCard = (itemListIdPrefix: string): void => {
    cy.get(
      `${this.repository.getItemListSelector(itemListIdPrefix)} ${this.repository.getItemListCardSelector()}[${ITEM_LIST_INDEX_ATTRIBUTE}]`
    )
      .first()
      .find(this.repository.getItemListCardLinkSelector())
      .first()
      .click();
  };

  private getItemList = (itemListIdPrefix: string): Cypress.Chainable =>
    cy.get(this.repository.getItemListSelector(itemListIdPrefix)).first();

  private getHitEvents = (url: string, body: unknown): GoogleAnalyticsEvent[] => {
    const sharedParameters = new URL(url).searchParams;
    const bodyLines = this.getHitBodyText(body).split(HIT_BODY_EVENT_SEPARATOR).filter(Boolean);
    const eventLines = bodyLines.length ? bodyLines : [''];

    return eventLines
      .map((eventLine: string): GoogleAnalyticsEvent => {
        const parameters = new URLSearchParams(sharedParameters);

        new URLSearchParams(eventLine).forEach((value: string, name: string): void => {
          parameters.set(name, value);
        });

        return {
          name: parameters.get(EVENT_NAME_PARAMETER) ?? '',
          parameters: Object.fromEntries(parameters.entries()),
          items: this.getItems(parameters),
        };
      })
      .filter((event: GoogleAnalyticsEvent): boolean => event.name !== '');
  };

  private getItems = (parameters: URLSearchParams): GoogleAnalyticsItem[] =>
    Array.from(parameters.keys())
      .filter((name: string): boolean => ITEM_PARAMETER_PATTERN.test(name))
      .map((name: string): GoogleAnalyticsItem => this.parseItem(parameters.get(name) ?? ''));

  private parseItem = (itemParameter: string): GoogleAnalyticsItem => {
    const fields: Record<string, string> = {};

    itemParameter.split(ITEM_FIELD_SEPARATOR).forEach((field: string): void => {
      fields[field.slice(0, ITEM_FIELD_NAME_LENGTH)] = field.slice(ITEM_FIELD_NAME_LENGTH);
    });

    const customParameters: Record<string, string> = {};

    Object.keys(fields).forEach((fieldName: string): void => {
      const customParameterMatch = CUSTOM_ITEM_PARAMETER_NAME_PATTERN.exec(fieldName);

      if (!customParameterMatch) {
        return;
      }

      const valueFieldName = `${CUSTOM_ITEM_PARAMETER_VALUE_PREFIX}${customParameterMatch[1]}`;
      customParameters[fields[fieldName]] = fields[valueFieldName] ?? '';
    });

    return {
      id: fields['id'] ?? '',
      name: fields['nm'] ?? '',
      brand: fields['br'] ?? '',
      variant: fields['va'] ?? '',
      categories: ITEM_CATEGORY_FIELD_NAMES.map((fieldName: string): string => fields[fieldName] ?? '').filter(Boolean),
      price: fields['pr'] ?? '',
      quantity: fields['qt'] ?? '',
      index: fields['lp'] ?? '',
      customParameters,
    };
  };
}

// GA4 encodes text event parameters as `ep.<name>`, numbers as `epn.<name>`, and the currency as `cu`.
export interface GoogleAnalyticsEvent {
  name: string;
  parameters: Record<string, string>;
  items: GoogleAnalyticsItem[];
}

export interface GoogleAnalyticsItem {
  id: string;
  name: string;
  brand: string;
  variant: string;
  // The category levels sent, top level first; empty when the item has no category.
  categories: string[];
  price: string;
  quantity: string;
  // The item's position in its list, sent for list events only.
  index: string;
  customParameters: Record<string, string>;
}

export interface GoogleAnalyticsTraffic {
  events: GoogleAnalyticsEvent[];
}

export interface ItemListViews {
  count: number;
}
