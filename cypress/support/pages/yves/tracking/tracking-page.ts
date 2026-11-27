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
// A project may take consent from HubSpot's cookie banner instead of the cookie, through HubSpot's command queue `_hsp`:
// it registers a listener with this command, which HubSpot calls with the stored consent and again on every change.
const HUBSPOT_ADD_CONSENT_LISTENER_COMMAND = 'addPrivacyConsentListener';
// HubSpot's cookie categories for the storefront's consent purposes, as such a project maps them.
const HUBSPOT_CATEGORIES_BY_CONSENT_PURPOSE: Readonly<Record<string, string>> = {
  statistics: 'analytics',
  marketing: 'advertisement',
  preferences: 'functionality',
};
const HUBSPOT_NECESSARY_CATEGORY = 'necessary';
// Marks the injected stand-in, so a page gets it once however many tests' intercepts see its response.
const HUBSPOT_STAND_IN_ATTRIBUTE = 'data-test-hubspot-stand-in';
const HEAD_OPENING_TAG_PATTERN = /<head[^>]*>/i;
const HTML_CONTENT_TYPE = 'text/html';
// The storefront's item list view tracker writes each card's position in its list here.
const ITEM_LIST_INDEX_ATTRIBUTE = 'data-item-list-index';

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
    this.reportConsentAsHubSpot();
    cy.setCookie(TRACKING_CONSENT_COOKIE_NAME, purposes.join(CONSENT_PURPOSE_SEPARATOR));
  };

  // No consent stored, for the next page that loads.
  removeTrackingConsent = (): void => {
    this.reportConsentAsHubSpot();
    cy.clearCookie(TRACKING_CONSENT_COOKIE_NAME);
  };

  /**
   * Stands in for HubSpot on every storefront page the current test loads: the consent stored in the consent cookie is
   * reported to a storefront that takes its consent from HubSpot, on load and on every consent change the test reports.
   * The stand-in is written into the page's head, so it is in place before the storefront's scripts run on every page,
   * including one a submitted form loads, which Cypress loads without its `window:before:load` event.
   * A storefront that reads the cookie itself never uses the stand-in. The real HubSpot script is not loaded by the tests.
   */
  private reportConsentAsHubSpot = (): void => {
    const standInSettings: HubSpotStandInSettings = {
      addConsentListenerCommand: HUBSPOT_ADD_CONSENT_LISTENER_COMMAND,
      categoriesByConsentPurpose: HUBSPOT_CATEGORIES_BY_CONSENT_PURPOSE,
      necessaryCategory: HUBSPOT_NECESSARY_CATEGORY,
      consentCookieName: TRACKING_CONSENT_COOKIE_NAME,
      consentPurposeSeparator: CONSENT_PURPOSE_SEPARATOR,
      consentChangeEvent: CONSENT_CHANGE_EVENT,
    };
    const standInScript = `<script ${HUBSPOT_STAND_IN_ATTRIBUTE}>(${installHubSpotStandIn.toString()})(${JSON.stringify(standInSettings)});</script>`;

    // Matched by what the browser asks for, a page: Cypress does not mark the page a submitted form loads as a document
    // request. Only a page's response is held and read; scripts, styles, images and ajax calls pass untouched, as holding
    // every response delays the page's load event.
    cy.intercept({ url: `${Cypress.config('baseUrl')}/**` }, (request): void => {
      const isPageRequest = String(request.headers['accept'] ?? '').includes(HTML_CONTENT_TYPE);

      if (!isPageRequest) {
        return;
      }

      request.on('response', (response): void => {
        const contentType = String(response.headers['content-type'] ?? '');
        const isPageWithoutStandIn =
          contentType.includes(HTML_CONTENT_TYPE) &&
          typeof response.body === 'string' &&
          !response.body.includes(HUBSPOT_STAND_IN_ATTRIBUTE);

        if (isPageWithoutStandIn) {
          response.body = response.body.replace(
            HEAD_OPENING_TAG_PATTERN,
            (headOpeningTag: string): string => headOpeningTag + standInScript
          );
        }
      });
    });
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

  // The storefront URL of a category node as the shop generates it, read from Glue: it is built from the category names.
  getCategoryUrl = (idCategoryNode: number, language: string): Cypress.Chainable<string> =>
    cy
      .request({
        url: `${Cypress.env('glueUrl')}/category-nodes/${idCategoryNode}`,
        headers: { 'Accept-Language': language },
      })
      .its('body.data.attributes.url');

  visitStorefrontPage = (url: string): void => {
    cy.visit(url);
  };

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

interface HubSpotConsent {
  allowed: boolean;
  categories: Record<string, boolean>;
}

type HubSpotConsentListener = (consent: HubSpotConsent) => void;

type HubSpotCommand = [string, ...unknown[]];

type HubSpotWindow = Window & { _hsp?: { push: (...commands: HubSpotCommand[]) => void } };

/**
 * Runs in the storefront page, where it is written as its own source text: it uses only its settings and the page's
 * globals, and the syntax the compilation keeps without helpers.
 */
function installHubSpotStandIn(settings: HubSpotStandInSettings): void {
  const hubSpotWindow = window as HubSpotWindow;
  const consentListeners: HubSpotConsentListener[] = [];

  const getGrantedPurposes = (): string[] => {
    const consentCookiePrefix = settings.consentCookieName + '=';
    const consentCookie = document.cookie
      .split(';')
      .map((cookie: string): string => cookie.trim())
      .find((cookie: string): boolean => cookie.indexOf(consentCookiePrefix) === 0);

    if (!consentCookie) {
      return [];
    }

    return decodeURIComponent(consentCookie.slice(consentCookiePrefix.length))
      .split(settings.consentPurposeSeparator)
      .filter(Boolean);
  };

  const getConsent = (): HubSpotConsent => {
    const grantedPurposes = getGrantedPurposes();
    const categories: Record<string, boolean> = {};
    categories[settings.necessaryCategory] = true;

    Object.keys(settings.categoriesByConsentPurpose).forEach((purpose: string): void => {
      categories[settings.categoriesByConsentPurpose[purpose]] = grantedPurposes.indexOf(purpose) !== -1;
    });

    return { allowed: grantedPurposes.length > 0, categories: categories };
  };

  const reportConsentTo = (consentListener: HubSpotConsentListener): void => {
    consentListener(getConsent());
  };

  hubSpotWindow._hsp = {
    push: function (): void {
      // eslint-disable-next-line prefer-rest-params
      const commands = Array.prototype.slice.call(arguments) as HubSpotCommand[];

      commands.forEach((command: HubSpotCommand): void => {
        const commandName = command[0];
        const commandArgument = command[1];

        if (commandName !== settings.addConsentListenerCommand || typeof commandArgument !== 'function') {
          return;
        }

        const consentListener = commandArgument as HubSpotConsentListener;
        consentListeners.push(consentListener);
        // HubSpot calls a new listener once its banner has loaded, never during the push.
        window.setTimeout((): void => reportConsentTo(consentListener));
      });
    },
  };
  document.addEventListener(settings.consentChangeEvent, (): void => consentListeners.forEach(reportConsentTo));
}

interface HubSpotStandInSettings {
  addConsentListenerCommand: string;
  categoriesByConsentPurpose: Readonly<Record<string, string>>;
  necessaryCategory: string;
  consentCookieName: string;
  consentPurposeSeparator: string;
  consentChangeEvent: string;
}
