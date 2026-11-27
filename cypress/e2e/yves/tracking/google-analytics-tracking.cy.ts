import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { GoogleAnalyticsTrackingDynamicFixtures, GoogleAnalyticsTrackingStaticFixtures } from '@interfaces/yves';
import { ConfigurationPage } from '@pages/backoffice';
import {
  CartPage,
  CatalogPage,
  GoogleAnalyticsEvent,
  GoogleAnalyticsItem,
  GoogleAnalyticsTraffic,
  ProductPage,
  TrackingPage,
  WishlistPage,
} from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

// gtag sends the hits of a page in batches, a few seconds after the events.
const GOOGLE_ANALYTICS_HIT_TIMEOUT = 30000;
const CART_LINES_TIMEOUT = 30000;
const VIEW_ITEM_EVENT = 'view_item';
const ADD_TO_CART_EVENT = 'add_to_cart';
const REMOVE_FROM_CART_EVENT = 'remove_from_cart';
const VIEW_ITEM_LIST_EVENT = 'view_item_list';
const SELECT_ITEM_EVENT = 'select_item';
const VIEW_CART_EVENT = 'view_cart';
const ADD_TO_WISHLIST_EVENT = 'add_to_wishlist';
const BEGIN_CHECKOUT_EVENT = 'begin_checkout';
const ADD_SHIPPING_INFO_EVENT = 'add_shipping_info';
const ADD_PAYMENT_INFO_EVENT = 'add_payment_info';
const PURCHASE_EVENT = 'purchase';
const PAGE_VIEW_EVENT = 'page_view';
// GA4 sends the page URL as `dl`, text event parameters as `ep.<name>`, numbers as `epn.<name>` and the currency as `cu`.
const PAGE_LOCATION_PARAMETER = 'dl';
const CURRENCY_PARAMETER = 'cu';
const VALUE_PARAMETER = 'epn.value';
const ITEM_LIST_ID_PARAMETER = 'ep.item_list_id';
const ITEM_LIST_NAME_PARAMETER = 'ep.item_list_name';
const SHIPPING_TIER_PARAMETER = 'ep.shipping_tier';
const PAYMENT_TYPE_PARAMETER = 'ep.payment_type';
const TRANSACTION_ID_PARAMETER = 'ep.transaction_id';
const FIRST_LIST_POSITION = '0';

describe('google analytics tracking', { tags: ['@yves', '@google-analytics', 'spryker-core'] }, (): void => {
  if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
    it.skip('skipped because the tracking tests run only for suite and b2b-mp', (): void => {});
    return;
  }

  // The wishlist is not part of the b2b-mp demo shop; its test runs for suite only.
  const itWithWishlist = Cypress.env('repositoryId') === 'suite' ? it : it.skip;

  const configurationPage = container.get(ConfigurationPage);
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const cartPage = container.get(CartPage);
  const wishlistPage = container.get(WishlistPage);
  const trackingPage = container.get(TrackingPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: GoogleAnalyticsTrackingStaticFixtures;
  let dynamicFixtures: GoogleAnalyticsTrackingDynamicFixtures;
  // The environment's own settings as the server rendered them, restored after the tests.
  const originalSettings: Record<string, OriginalSetting> = {};
  // An environment's own Measurement ID is kept: the hits are answered by the test and never reach Google Analytics.
  let isTestMeasurementIdUsed = false;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    readOriginalSettings();
    applyEventSettings();
    requireTrackingConsent();
  });

  after((): void => {
    restoreOriginalSettings();
    restoreTrackingConsentRequirement();
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    // Without consent yet, the pages of the clearing send no hits that a test could record; the cart page a test starts on
    // has it.
    cartPage.visit();
    cartPage.clearCartIfNotEmpty();
    trackingPage.grantTrackingConsent([staticFixtures.statisticsConsentPurpose]);
    cartPage.visit();
  });

  it('customer without tracking consent should not be tracked, and gtag.js should not be loaded', (): void => {
    // The cart page of beforeEach has consent, so a page without consent is loaded before the hits are recorded. The
    // browser may still send the last hits of that cart page after it left it, so only the hits of the test's own pages count.
    trackingPage.removeTrackingConsent();
    cartPage.visit();
    trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    // Without consent gtag.js does not load, so only the adapter is waited for: once it is mounted, the orchestrator has
    // decided whether it may start. The product is searched from the header of the open page: the catalog page would load
    // every product image of the shop first, which a demo shop with remote images, e.g. b2b-mp, can take longer to finish
    // than the page load timeout.
    catalogPage.openProductPageFromSuggestions({ query: dynamicFixtures.product.sku });
    trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
    trackingPage.getGtagScript().should('not.exist');

    cy.location('pathname').then((productPagePath: string): void => {
      addProductToCart();
      cartPage.visit();
      trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
      trackingPage.getGtagScript().should('not.exist');

      cy.then((): void => {
        expect(getEvents(traffic, ADD_TO_CART_EVENT), describeRecordedEvents(traffic)).to.have.length(0);
        expect(getPageViews(traffic, productPagePath), describeRecordedEvents(traffic)).to.have.length(0);
      });
    });
  });

  it('customer on a product page should be tracked with view_item and, adding the product, with add_to_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      [VIEW_ITEM_EVENT, ADD_TO_CART_EVENT].forEach((eventName: string): void => {
        const events = getEvents(recordedTraffic, eventName);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectProductEvent(events[0], 1);
      });
    });
  });

  it('customer on a category page should be tracked with view_item_list and select_item of the category list', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    trackingPage.visitStorefrontPage(staticFixtures.categoryUrl);

    // The click leaves the page, so the list view is sent before.
    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, VIEW_ITEM_LIST_EVENT);

      expect(events).to.have.length.greaterThan(0);
      expect(events[0].parameters[ITEM_LIST_ID_PARAMETER]).to.match(
        new RegExp(`^${staticFixtures.categoryListIdPrefix}\\d+$`)
      );
      expect(events[0].parameters[ITEM_LIST_NAME_PARAMETER]).to.equal(staticFixtures.categoryName);
      expect(events[0].items[0].index).to.equal(FIRST_LIST_POSITION);
    });

    trackingPage.openFirstItemListCard(staticFixtures.categoryListIdPrefix);

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const listView = getEvents(recordedTraffic, VIEW_ITEM_LIST_EVENT)[0];
      const events = getEvents(recordedTraffic, SELECT_ITEM_EVENT);

      expect(events).to.have.length(1);
      expect(events[0].parameters[ITEM_LIST_ID_PARAMETER]).to.equal(listView.parameters[ITEM_LIST_ID_PARAMETER]);
      expect(events[0].items).to.have.length(1);
      expect(events[0].items[0].id).to.equal(listView.items[0].id);
      expect(events[0].items[0].index).to.equal(FIRST_LIST_POSITION);
    });
  });

  it('customer opening the cart and removing a product should be tracked with view_cart and remove_from_cart', (): void => {
    openProductPage();
    addProductToCart();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openCartWithLoadedLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const viewCartEvents = getEvents(recordedTraffic, VIEW_CART_EVENT);
      const removeFromCartEvents = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(viewCartEvents, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(viewCartEvents[0], 1, getPriceAfterDiscounts());
      expect(removeFromCartEvents, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(removeFromCartEvents[0], 1);
    });
  });

  itWithWishlist(
    'customer adding a product to a wishlist on the product page should be tracked with add_to_wishlist',
    (): void => {
      wishlistPage.visit();
      const wishlistName = wishlistPage.createWishlist();
      openProductPage();
      const traffic = trackingPage.recordGoogleAnalyticsTraffic();

      wishlistPage.clickAddDisplayedProductToWishlist(wishlistName);

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        const events = getEvents(recordedTraffic, ADD_TO_WISHLIST_EVENT);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectProductEvent(events[0], 1);
      });
    }
  );

  it('customer placing an order should be tracked with begin_checkout, add_shipping_info, add_payment_info and purchase', (): void => {
    openProductPage();
    addProductToCart();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.address.id_customer_address,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      [BEGIN_CHECKOUT_EVENT, ADD_SHIPPING_INFO_EVENT, ADD_PAYMENT_INFO_EVENT].forEach((eventName: string): void => {
        const events = getEvents(recordedTraffic, eventName);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectProductEvent(events[0], 1, getPriceAfterDiscounts());
      });
      expect(getEvents(recordedTraffic, ADD_SHIPPING_INFO_EVENT)[0].parameters[SHIPPING_TIER_PARAMETER]).to.equal(
        staticFixtures.shippingTier
      );
      expect(getEvents(recordedTraffic, ADD_PAYMENT_INFO_EVENT)[0].parameters[PAYMENT_TYPE_PARAMETER]).to.equal(
        staticFixtures.paymentType
      );

      const purchaseEvents = getEvents(recordedTraffic, PURCHASE_EVENT);

      expect(purchaseEvents, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectPurchaseEvent(purchaseEvents[0]);
    });
  });

  // Last: it leaves add_to_cart switched off until the settings are restored after the tests.
  it('customer adding a product should not be tracked when add_to_cart is switched off in the Back Office', (): void => {
    applyEventSettings([ADD_TO_CART_EVENT]);
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    trackingPage.grantTrackingConsent([staticFixtures.statisticsConsentPurpose]);
    // The settings left the Back Office open: the product is searched from the header of a storefront page.
    cartPage.visit();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();
    openCartWithLoadedLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    // The removal is still tracked, so its hit shows that the hits of the add have been sent as well.
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expect(
        getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT),
        describeRecordedEvents(recordedTraffic)
      ).to.have.length(1);
      expect(getEvents(recordedTraffic, ADD_TO_CART_EVENT), describeRecordedEvents(recordedTraffic)).to.have.length(0);
    });
  });

  // The cart page loads its lines with a separate request, which a busy environment answers later than the default command
  // timeout, so the lines are waited for before a test acts on them.
  function openCartWithLoadedLines(): void {
    cy.intercept('**/cart/get-cart-items*').as('cartLines');
    cartPage.visit();
    cy.wait('@cartLines', { responseTimeout: CART_LINES_TIMEOUT });
  }

  // The next page visit would cancel the request that adds the product, so it waits for the request to finish.
  function addProductToCart(): void {
    cy.intercept('POST', '**/cart/add/**').as('cartAdd');
    productPage.addToCart();
    cy.wait('@cartAdd', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // Searched from the header of the open page, see the test without consent.
  function openProductPage(): void {
    catalogPage.openProductPageFromSuggestions({ query: dynamicFixtures.product.sku });
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // Names the recorded events in a failed count, so the failure shows what was sent instead.
  function describeRecordedEvents(traffic: GoogleAnalyticsTraffic): string {
    const eventNames = traffic.events.map((event: GoogleAnalyticsEvent): string => event.name);

    return `recorded events: ${eventNames.join(', ') || 'none'}`;
  }

  function getEvents(traffic: GoogleAnalyticsTraffic, eventName: string): GoogleAnalyticsEvent[] {
    return traffic.events.filter((event: GoogleAnalyticsEvent): boolean => event.name === eventName);
  }

  function getPageViews(traffic: GoogleAnalyticsTraffic, pagePath: string): GoogleAnalyticsEvent[] {
    return getEvents(traffic, PAGE_VIEW_EVENT).filter(
      (event: GoogleAnalyticsEvent): boolean => new URL(event.parameters[PAGE_LOCATION_PARAMETER]).pathname === pagePath
    );
  }

  // The cart and checkout events report the price after the cart discounts: the demo discount "10% off minimum order"
  // applies to every cart of 100 EUR or more.
  function getPriceAfterDiscounts(): number {
    return Number(staticFixtures.productPriceAfterDiscounts);
  }

  // The product is reported by its abstract SKU, abstract name and brand, with the concrete SKU as a custom item parameter.
  function expectProductEvent(
    event: GoogleAnalyticsEvent,
    quantity: number,
    productPrice: number = Number(staticFixtures.productPrice)
  ): void {
    expect(event.parameters[CURRENCY_PARAMETER], event.name).to.equal(staticFixtures.currency);
    expect(Number(event.parameters[VALUE_PARAMETER]), event.name).to.equal(productPrice * quantity);
    expectFixtureProductItem(event, quantity);
    expect(Number(event.items[0].price), event.name).to.equal(productPrice);
  }

  // The order is reported by its reference. Its price is paid without tax, as tax and shipping are reported on their own,
  // so the price depends on the tax set and is not checked.
  function expectPurchaseEvent(event: GoogleAnalyticsEvent): void {
    expect(event.parameters[TRANSACTION_ID_PARAMETER], event.name).to.not.be.empty;
    expect(event.parameters[CURRENCY_PARAMETER], event.name).to.equal(staticFixtures.currency);
    expectFixtureProductItem(event, 1);
  }

  // The concrete product has a name of its own, so this also shows the concrete name is not sent. The fixture product has a
  // brand, but a single concrete product and no category, so it has no variant or category path to report.
  function expectFixtureProductItem(event: GoogleAnalyticsEvent, quantity: number): void {
    expect(event.items, event.name).to.have.length(1);

    const item: GoogleAnalyticsItem = event.items[0];

    expect(item.id, event.name).to.equal(dynamicFixtures.product.abstract_sku);
    expect(item.name, event.name).to.equal(dynamicFixtures.abstractLocalizedAttributes.name);
    expect(item.name, event.name).to.not.equal(dynamicFixtures.concreteLocalizedAttributes.name);
    expect(item.brand, event.name).to.equal(dynamicFixtures.abstractLocalizedAttributes.attributes.brand);
    expect(item.variant, event.name).to.be.empty;
    expect(item.categories, event.name).to.be.empty;
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
    [staticFixtures.measurementIdSetting, ...Object.values(staticFixtures.eventSettings)].forEach(readOriginalSetting);
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

  // Every event is switched on except the given ones.
  function applyEventSettings(disabledEvents: string[] = []): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.googleAnalyticsTab);
    cy.then((): void => {
      const isMeasurementIdConfigured = originalSettings[staticFixtures.measurementIdSetting].value !== '';

      if (!isMeasurementIdConfigured) {
        isTestMeasurementIdUsed = true;
        configurationPage.setTextSetting(staticFixtures.measurementIdSetting, staticFixtures.measurementId);
      }
    });

    const eventStates: Record<string, boolean> = {};

    Object.entries(staticFixtures.eventSettings).forEach(([eventName, settingKey]): void => {
      const isEventEnabled = !disabledEvents.includes(eventName);

      eventStates[eventName] = isEventEnabled;
      configurationPage.setBooleanSetting(settingKey, isEventEnabled);
    });
    saveConfiguration();

    trackingPage.waitForEventSettings(eventStates);
  }

  function restoreOriginalSettings(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.googleAnalyticsTab);
    cy.then((): void => {
      if (isTestMeasurementIdUsed) {
        restoreSetting(staticFixtures.measurementIdSetting, false);
      }

      Object.values(staticFixtures.eventSettings).forEach((settingKey: string): void =>
        restoreSetting(settingKey, true)
      );
    });
    saveConfiguration();
    cy.runQueueWorker();
  }

  // Consent is required by default; an environment that switched it off gets it back after the tests.
  function requireTrackingConsent(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.trackingConsentTab);
    readOriginalSetting(staticFixtures.consentRequiredSetting);
    configurationPage.setBooleanSetting(staticFixtures.consentRequiredSetting, true);
    saveConfiguration();

    trackingPage.waitForTrackingConsentRequirement(true);
  }

  function restoreTrackingConsentRequirement(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.trackingConsentTab);
    cy.then((): void => {
      restoreSetting(staticFixtures.consentRequiredSetting, true);
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
