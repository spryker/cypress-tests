import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { TrackingRepository } from './tracking-repository';

// gtag.js is loaded from Google; the hits it sends are answered here, so no test data reaches Google Analytics.
const GOOGLE_ANALYTICS_HIT_URL_PATTERN = /google-analytics\.com\/g\/collect/;
const NO_CONTENT_STATUS_CODE = 204;
// A GA4 hit carries one event in its query, or several in its body, one per line.
const HIT_BODY_EVENT_SEPARATOR = '\r\n';
const EVENT_NAME_PARAMETER = 'en';
const ITEM_PARAMETER_PATTERN = /^pr\d+$/;
// An item is one parameter of `~`-separated fields, each a two-character name and its value, e.g. `idSKU-1~qt2`.
const ITEM_FIELD_SEPARATOR = '~';
const ITEM_FIELD_NAME_LENGTH = 2;
// A custom item parameter is a pair of fields: `k<n>` holds its name and `v<n>` its value.
const CUSTOM_ITEM_PARAMETER_NAME_PATTERN = /^k(\d)$/;
const CUSTOM_ITEM_PARAMETER_VALUE_PREFIX = 'v';
// A Back Office configuration change reaches the storefront once the publish and synchronize queues are processed.
const SETTINGS_SYNC_COMMANDS = ['console queue:worker:start --stop-when-empty'];
const SETTINGS_SYNC_RETRIES = 10;
const SETTINGS_SYNC_RETRY_WAIT = 2000;

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

  getGoogleAnalyticsAdapter = (): Cypress.Chainable => cy.get(this.repository.getGoogleAnalyticsAdapterSelector());

  private getHitEvents = (url: string, body: unknown): GoogleAnalyticsEvent[] => {
    const sharedParameters = new URL(url).searchParams;
    const bodyLines = typeof body === 'string' ? body.split(HIT_BODY_EVENT_SEPARATOR).filter(Boolean) : [];
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
      price: fields['pr'] ?? '',
      quantity: fields['qt'] ?? '',
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
  price: string;
  quantity: string;
  customParameters: Record<string, string>;
}

export interface GoogleAnalyticsTraffic {
  events: GoogleAnalyticsEvent[];
}
