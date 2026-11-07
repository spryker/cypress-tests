import { container } from '@utils';
import { GoogleAnalyticsTrackingDynamicFixtures, GoogleAnalyticsTrackingStaticFixtures } from '@interfaces/yves';
import { ConfigurationPage } from '@pages/backoffice';
import {
  CartPage,
  CatalogPage,
  GoogleAnalyticsEvent,
  GoogleAnalyticsTraffic,
  ProductPage,
  TrackingPage,
} from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

// gtag sends the hits of a page in batches, a few seconds after the events.
const GOOGLE_ANALYTICS_HIT_TIMEOUT = 30000;
const ADD_TO_CART_EVENT = 'add_to_cart';
const REMOVE_FROM_CART_EVENT = 'remove_from_cart';

describe('google analytics tracking', { tags: ['@yves', '@google-analytics', 'spryker-core'] }, (): void => {
  if (Cypress.env('repositoryId') !== 'suite') {
    it.skip('skipped because the tracking repository is bound for suite only', (): void => {});
    return;
  }

  const configurationPage = container.get(ConfigurationPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const cartPage = container.get(CartPage);
  const trackingPage = container.get(TrackingPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: GoogleAnalyticsTrackingStaticFixtures;
  let dynamicFixtures: GoogleAnalyticsTrackingDynamicFixtures;
  // The environment's own settings as the server rendered them, restored after the tests.
  const originalSettings: Record<string, OriginalSetting> = {};
  // An environment's own Measurement ID is kept: the hits are answered by the test and never reach Google Analytics.
  let isTestMeasurementIdUsed = false;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    readOriginalSettings();
    applyEventSettings({ isAddToCartEnabled: true, isRemoveFromCartEnabled: true });
  });

  after((): void => {
    restoreOriginalSettings();
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    // The page of the clearing has sent its hits before the next test page records any.
    cartPage.visit();
    cartPage.clearCartIfNotEmpty();
    cartPage.visit();
  });

  it('customer adding a product on the product page should be tracked with add_to_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    productPage.addToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer removing a product on the cart page should be tracked with remove_from_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    productPage.addToCart();
    cartPage.visit();
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(events).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer changing the quantity on the cart page should be tracked with the quantity difference', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    productPage.addToCart();
    cartPage.visit();

    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      // The first one is the add on the product page.
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events).to.have.length(2);
      expectProductEvent(events[1], 2);
    });

    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(events).to.have.length(1);
      expectProductEvent(events[0], 2);
    });
  });

  it('customer adding a product should not be tracked when add_to_cart is switched off in the Back Office', (): void => {
    applyEventSettings({ isAddToCartEnabled: false, isRemoveFromCartEnabled: true });
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    productPage.addToCart();
    cartPage.visit();
    // The removal is still tracked, so its hit shows that the hits of the add have been sent as well.
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expect(getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT)).to.have.length(1);
      expect(getEvents(recordedTraffic, ADD_TO_CART_EVENT)).to.have.length(0);
    });
  });

  function openProductPage(): void {
    catalogPage.visit();
    catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
    trackingPage.getGoogleAnalyticsAdapter().should('exist');
  }

  function getEvents(traffic: GoogleAnalyticsTraffic, eventName: string): GoogleAnalyticsEvent[] {
    return traffic.events.filter((event: GoogleAnalyticsEvent): boolean => event.name === eventName);
  }

  // The product is reported by its abstract SKU, with the concrete SKU as a custom item parameter.
  function expectProductEvent(event: GoogleAnalyticsEvent, quantity: number): void {
    const productPrice = Number(staticFixtures.productPrice);

    expect(event.parameters['cu'], event.name).to.equal(staticFixtures.currency);
    expect(Number(event.parameters['epn.value']), event.name).to.equal(productPrice * quantity);
    expect(event.items, event.name).to.have.length(1);

    const item = event.items[0];

    expect(item.id, event.name).to.equal(dynamicFixtures.product.abstract_sku);
    expect(item.name, event.name).to.not.be.empty;
    expect(Number(item.price), event.name).to.equal(productPrice);
    expect(Number(item.quantity), event.name).to.equal(quantity);
    expect(item.customParameters[staticFixtures.concreteSkuParameter], event.name).to.equal(
      dynamicFixtures.product.sku
    );
  }

  function loginToBackoffice(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  }

  function readOriginalSettings(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.googleAnalyticsTab);
    [
      staticFixtures.measurementIdSetting,
      staticFixtures.addToCartSetting,
      staticFixtures.removeFromCartSetting,
    ].forEach(readOriginalSetting);
  }

  // Read from the attributes the server rendered, not from the input, whose value the page's scripts may change.
  function readOriginalSetting(settingKey: string): void {
    configurationPage.getSettingInput(settingKey).then(($input: JQuery<HTMLElement>): void => {
      originalSettings[settingKey] = {
        hasCustomValue: $input.attr('data-has-custom-value') === '1',
        value: String($input.attr('data-original-value') ?? ''),
      };
    });
  }

  function applyEventSettings(params: EventSettingsParams): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.googleAnalyticsTab);
    cy.then((): void => {
      const isMeasurementIdConfigured = originalSettings[staticFixtures.measurementIdSetting].value !== '';

      if (!isMeasurementIdConfigured) {
        isTestMeasurementIdUsed = true;
        configurationPage.setTextSetting(staticFixtures.measurementIdSetting, staticFixtures.measurementId);
      }
    });
    configurationPage.setBooleanSetting(staticFixtures.addToCartSetting, params.isAddToCartEnabled);
    configurationPage.setBooleanSetting(staticFixtures.removeFromCartSetting, params.isRemoveFromCartEnabled);
    saveConfiguration();

    trackingPage.waitForEventSettings({
      [ADD_TO_CART_EVENT]: params.isAddToCartEnabled,
      [REMOVE_FROM_CART_EVENT]: params.isRemoveFromCartEnabled,
    });
  }

  function restoreOriginalSettings(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.googleAnalyticsTab);
    cy.then((): void => {
      if (isTestMeasurementIdUsed) {
        restoreSetting(staticFixtures.measurementIdSetting, false);
      }

      restoreSetting(staticFixtures.addToCartSetting, true);
      restoreSetting(staticFixtures.removeFromCartSetting, true);
    });
    saveConfiguration();
    cy.runQueueWorker();
  }

  // A setting without a stored value goes back to its default; a stored one gets its value back.
  function restoreSetting(settingKey: string, isBoolean: boolean): void {
    const originalSetting = originalSettings[settingKey];

    if (!originalSetting.hasCustomValue) {
      restoreDefault(settingKey);

      return;
    }

    if (isBoolean) {
      configurationPage.setBooleanSetting(settingKey, originalSetting.value === 'true');

      return;
    }

    configurationPage.setTextSetting(settingKey, originalSetting.value);
  }

  // "Use default" is offered only for a stored value; a setting the tests never stored is at its default already.
  function restoreDefault(settingKey: string): void {
    configurationPage.getSettingInput(settingKey).then(($input: JQuery<HTMLElement>): void => {
      const hasStoredValue = $input.attr('data-has-custom-value') === '1';

      if (hasStoredValue) {
        configurationPage.clickUseDefaultLink(settingKey);
      }
    });
  }

  // A save without changes shows no save bar, so there is nothing to wait for.
  function saveConfiguration(): void {
    configurationPage.getSaveBar().then(($saveBar: JQuery<HTMLElement>): void => {
      if (!$saveBar.is(':visible')) {
        return;
      }

      configurationPage.saveConfiguration();
      configurationPage.getChangesCount().should('not.be.visible');
    });
  }
});

interface OriginalSetting {
  hasCustomValue: boolean;
  value: string;
}

interface EventSettingsParams {
  isAddToCartEnabled: boolean;
  isRemoveFromCartEnabled: boolean;
}
