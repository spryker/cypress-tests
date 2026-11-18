import { container, getPaymentMethodBasedOnEnv } from '@utils';
import {
  GoogleAnalyticsTrackingDynamicFixtures,
  GoogleAnalyticsTrackingStaticFixtures,
  TrackedAbstractProduct,
} from '@interfaces/yves';
import { ConfigurationPage } from '@pages/backoffice';
import {
  BundleConfiguratorPage,
  CartPage,
  CatalogPage,
  CompanyUserSelectPage,
  CustomerOverviewPage,
  GoogleAnalyticsEvent,
  GoogleAnalyticsItem,
  GoogleAnalyticsTraffic,
  OrderDetailsPage,
  ProductPage,
  ProductSetsPage,
  QuickOrderPage,
  QuoteRequestPage,
  ShoppingListPage,
  SlotProduct,
  TrackingPage,
  WishlistPage,
} from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AgentLoginScenario, CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

// gtag sends the hits of a page in batches, a few seconds after the events.
const GOOGLE_ANALYTICS_HIT_TIMEOUT = 30000;
// Opening the shopping list loads a full page, which a busy environment takes longer than the default command timeout for.
const SHOPPING_LIST_PAGE_TIMEOUT = 30000;
const CART_LINES_TIMEOUT = 30000;
const VARIANT_PAGE_TIMEOUT = 10000;
// A reorder test checks out right after the cart page opens: the session lock queues every checkout step behind the cart
// page's own requests, which can outlast the default command timeout.
const CHECKOUT_COMMAND_TIMEOUT = 30000;
const ORDER_DETAILS_PATH = '/customer/order/details';
const ADD_TO_CART_EVENT = 'add_to_cart';
const REMOVE_FROM_CART_EVENT = 'remove_from_cart';
const PAGE_VIEW_EVENT = 'page_view';
// GA4 sends the page URL of a hit as `dl`.
const PAGE_LOCATION_PARAMETER = 'dl';

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
  const wishlistPage = container.get(WishlistPage);
  const shoppingListPage = container.get(ShoppingListPage);
  const quickOrderPage = container.get(QuickOrderPage);
  const bundleConfiguratorPage = container.get(BundleConfiguratorPage);
  const productSetsPage = container.get(ProductSetsPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const orderDetailsPage = container.get(OrderDetailsPage);
  const companyUserSelectPage = container.get(CompanyUserSelectPage);
  const quoteRequestPage = container.get(QuoteRequestPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const agentLoginScenario = container.get(AgentLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);

  let staticFixtures: GoogleAnalyticsTrackingStaticFixtures;
  let dynamicFixtures: GoogleAnalyticsTrackingDynamicFixtures;
  // The environment's own settings as the server rendered them, restored after the tests.
  const originalSettings: Record<string, OriginalSetting> = {};
  // An environment's own Measurement ID is kept: the hits are answered by the test and never reach Google Analytics.
  let isTestMeasurementIdUsed = false;
  let quoteRequestReference: string;
  let configuredBundleProducts: TrackedAbstractProduct[];

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    readOriginalSettings();
    applyEventSettings({ isAddToCartEnabled: true, isRemoveFromCartEnabled: true });
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

  it('customer adding a product on the product page should be tracked with add_to_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer removing a product on the cart page should be tracked with remove_from_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();
    openCartWithLoadedLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer changing the quantity on the cart page should be tracked with the quantity difference', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();
    openCartWithLoadedLines();

    trackingPage.waitForGoogleAnalyticsToLoad();
    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 3 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      // The first one is the add on the product page.
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(2);
      expectProductEvent(events[1], 2);
    });

    cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 2);
    });
  });

  // A demo product, as the catalog search does not find the fixture product by its SKU of digits only.
  it('customer quick adding a product from its catalog card should be tracked with add_to_cart', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    catalogPage.openSearchResults({ query: staticFixtures.catalogProduct.sku });
    trackingPage.waitForGoogleAnalyticsToLoad();
    catalogPage.quickAddFirstProductItemToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectEventsReportAbstractProducts(events, [staticFixtures.catalogProduct]);
    });
  });

  // A demo product with images, as the wishlist page does not render a product without images.
  it('customer moving a product from the wishlist to the cart should be tracked with add_to_cart', (): void => {
    wishlistPage.visit();
    const wishlistName = wishlistPage.createWishlist();
    openProductPage(staticFixtures.wishlistProduct.sku);
    wishlistPage.addDisplayedProductToWishlist(wishlistName);
    wishlistPage.visit();
    wishlistPage.openWishlist(wishlistName);
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    wishlistPage.moveItemToCart({ sku: staticFixtures.wishlistProduct.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectEventsReportAbstractProducts(events, [staticFixtures.wishlistProduct]);
    });
  });

  it('company user adding a product of a shopping list to the cart should be tracked with add_to_cart', (): void => {
    openShoppingListWithProduct();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    shoppingListPage.addItemToCart({ sku: dynamicFixtures.product.sku });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('company user adding all available products of a shopping list to the cart should be tracked with add_to_cart', (): void => {
    openShoppingListWithProduct();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    shoppingListPage.addAllAvailableProductsToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer adding a product through quick order should be tracked with add_to_cart', (): void => {
    quickOrderPage.visit();
    trackingPage.waitForGoogleAnalyticsToLoad();
    quickOrderPage.verifyPastedOrder(`${dynamicFixtures.product.sku},1`);
    quickOrderPage.waitForTrackedRow(dynamicFixtures.product.sku);
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    quickOrderPage.addRowsToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer adding a configured bundle to the cart should be tracked with add_to_cart for its products', (): void => {
    openConfiguredBundleSummary();
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    bundleConfiguratorPage.addConfiguredBundleToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expectEventsReportAbstractProducts(getEvents(recordedTraffic, ADD_TO_CART_EVENT), configuredBundleProducts);
    });
  });

  it('customer adding a product set to the cart should be tracked with add_to_cart for its products', (): void => {
    productSetsPage.visit();
    productSetsPage.openProductSet(staticFixtures.productSet.name);
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    productSetsPage.addAllProductsToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expectEventsReportAbstractProducts(
        getEvents(recordedTraffic, ADD_TO_CART_EVENT),
        staticFixtures.productSet.products
      );
    });
  });

  it('customer adding a product set from a CMS page to the cart should be tracked with add_to_cart for its products', (): void => {
    cy.visit(staticFixtures.productSet.cmsPageUrl);
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    productSetsPage.addAllCmsContentProductsToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expectEventsReportAbstractProducts(
        getEvents(recordedTraffic, ADD_TO_CART_EVENT),
        staticFixtures.productSet.products
      );
    });
  });

  it('customer removing a configured bundle on the cart page should be tracked with remove_from_cart for its products', (): void => {
    openConfiguredBundleSummary();
    addConfiguredBundleAndWaitForCartLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    cartPage.removeConfiguredBundle(staticFixtures.configuredBundle.templateName);

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expectEventsReportAbstractProducts(getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT), configuredBundleProducts);
    });
  });

  it('customer clearing the cart should be tracked with remove_from_cart for its lines', (): void => {
    openProductPage();
    addProductToCart();
    openCartWithLoadedLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    cartPage.clickClearCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  it('customer quick adding a product on the cart page should be tracked with add_to_cart', (): void => {
    trackingPage.waitForGoogleAnalyticsToLoad();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 2 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 2);
    });
  });

  it(
    'customer reordering selected items of an order should be tracked with add_to_cart',
    { defaultCommandTimeout: CHECKOUT_COMMAND_TIMEOUT },
    (): void => {
      openDetailsOfPlacedOrder();
      const traffic = trackingPage.recordGoogleAnalyticsTraffic();

      orderDetailsPage.reorderFirstSalesOrderItem();

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectProductEvent(events[0], 1);
      });
    }
  );

  it(
    'customer reordering all items of an order should be tracked with add_to_cart',
    { defaultCommandTimeout: CHECKOUT_COMMAND_TIMEOUT },
    (): void => {
      openDetailsOfPlacedOrder();
      const traffic = trackingPage.recordGoogleAnalyticsTraffic();

      orderDetailsPage.reorderAll();

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectProductEvent(events[0], 1);
      });
    }
  );

  // The price is not checked: the quote request sends it only to a company user allowed to see prices.
  // Creating, revising and sending back the quote request each take a slow server round trip.
  it(
    'company user converting a quote request to the cart should be tracked with add_to_cart',
    { defaultCommandTimeout: CHECKOUT_COMMAND_TIMEOUT },
    (): void => {
      openQuoteRequestSentBackByAgent();
      const traffic = trackingPage.recordGoogleAnalyticsTraffic();

      cy.then((): void => quoteRequestPage.convertToCart(quoteRequestReference));

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expect(events[0].items, events[0].name).to.have.length(1);

        const item = events[0].items[0];

        expect(item.id, events[0].name).to.equal(dynamicFixtures.product.abstract_sku);
        expect(item.name, events[0].name).to.equal(dynamicFixtures.abstractLocalizedAttributes.name);
        expectFixtureProductDetails(item, events[0].name);
      });
    }
  );

  it('customer adding a variant on the product page should be tracked with its item details', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    addVariantOnProductPage();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events).to.have.length(1);
      expectVariantProductItem(events[0]);
    });
  });

  it('customer changing the quantity of a variant in the cart should be tracked with the item details of the product page', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    addVariantOnProductPage();
    cartPage.visit();
    cartPage.changeQuantity({ sku: staticFixtures.variantProduct.concreteSku, quantity: 2 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      // The first one is the add on the product page, the second one the cart line.
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events).to.have.length(2);
      expectVariantProductItem(events[1]);
      expect(events[1].items[0].categories, 'cart line categories').to.deep.equal(events[0].items[0].categories);
    });
  });

  // The order item keeps the selected variant attributes, so the reorder reports the variant the customer ordered.
  it(
    'customer reordering a variant should be tracked with the item details of the ordered variant',
    { defaultCommandTimeout: CHECKOUT_COMMAND_TIMEOUT },
    (): void => {
      openDetailsOfPlacedOrder(addVariantOnProductPage);
      const traffic = trackingPage.recordGoogleAnalyticsTraffic();

      orderDetailsPage.reorderAll();

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

        expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
        expectVariantProductItem(events[0]);
      });
    }
  );

  it('customer adding a product from a search result card should be tracked with its brand and categories', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    catalogPage.visit();
    catalogPage.searchForProducts({ query: staticFixtures.searchResultProduct.concreteSku });
    trackingPage.waitForGoogleAnalyticsToLoad();
    catalogPage.quickAddFirstProductItemToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events).to.have.length(1);
      expect(events[0].items).to.have.length(1);

      const item = events[0].items[0];

      expect(item.id).to.equal(staticFixtures.searchResultProduct.abstractSku);
      expect(item.categories).to.not.be.empty;
      // The search result data of a card has no product attributes: the product tracking details of the page add the brand.
      expect(item.brand).to.equal(staticFixtures.searchResultProduct.brand);
    });
  });

  // GA4 counts whole pieces: the quantity the customer enters in the sales unit, here a fraction of one, is rounded and
  // stays at least 1.
  it('customer adding a measurement unit product in a fraction of its sales unit should be tracked with a whole quantity', (): void => {
    const { quantity, trackedQuantity } = staticFixtures.measurementUnitAdd;
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    // The product has one sales unit, meter, so the page offers no choice of unit.
    openProductPage(dynamicFixtures.measurementUnitProduct.sku);
    productPage.setSalesUnitQuantity({ quantity });
    addProductToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expect(events[0].items).to.have.length(1);
      expect(events[0].items[0].id).to.equal(dynamicFixtures.measurementUnitProduct.abstract_sku);
      expect(Number(events[0].items[0].quantity)).to.equal(trackedQuantity);
    });
  });

  it('customer without tracking consent should not be tracked, and gtag.js should not be loaded', (): void => {
    startWithoutTrackingConsent();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    addProductOnUntrackedPagesAndExpectNoHits(traffic);
  });

  // Google Analytics serves statistics; consent to another purpose does not start it.
  it('customer consenting to marketing only should not be tracked, and gtag.js should not be loaded', (): void => {
    startWithoutTrackingConsent();
    trackingPage.grantTrackingConsent([staticFixtures.marketingConsentPurpose]);
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    addProductOnUntrackedPagesAndExpectNoHits(traffic);
  });

  it('customer consenting on the page should be tracked from then on, with the page view of that page sent once', (): void => {
    startWithoutTrackingConsent();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openUntrackedProductPage();
    trackingPage.getGtagScript().should('not.exist');

    trackingPage.grantTrackingConsentOnPage([staticFixtures.statisticsConsentPurpose]);
    // A consent management platform may report the same consent again; the page view is still sent once.
    trackingPage.grantTrackingConsentOnPage([staticFixtures.statisticsConsentPurpose]);
    trackingPage.waitForGoogleAnalyticsToLoad();

    cy.location('pathname').then((productPagePath: string): void => {
      addProductToCart();

      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        expect(getEvents(recordedTraffic, ADD_TO_CART_EVENT), describeRecordedEvents(recordedTraffic)).to.have.length(
          1
        );
        expect(getPageViews(recordedTraffic, productPagePath), describeRecordedEvents(recordedTraffic)).to.have.length(
          1
        );
      });
    });
  });

  it('customer withdrawing tracking consent on the page should not be tracked from then on', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();
    let hitsBeforeWithdrawal = 0;

    openProductPage();

    cy.location('pathname').then((productPagePath: string): void => {
      // The page view shows that Google Analytics sends while consent is given.
      cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
        expect(getPageViews(recordedTraffic, productPagePath), describeRecordedEvents(recordedTraffic)).to.have.length(
          1
        );
      });
    });

    cy.then((): void => {
      hitsBeforeWithdrawal = traffic.events.length;
    });
    trackingPage.withdrawTrackingConsentOnPage();
    addProductToCart();
    cartPage.visit();

    // The cart page has loaded, so the product page has sent every hit it had.
    trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
    trackingPage.getGtagScript().should('not.exist');
    cy.then((): void => {
      expect(traffic.events.slice(hitsBeforeWithdrawal)).to.deep.equal([]);
    });
  });

  // Google Analytics is set up already on that page, so it only starts sending again.
  it('customer consenting again on the page after withdrawing should be tracked again', (): void => {
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    trackingPage.withdrawTrackingConsentOnPage();
    trackingPage.grantTrackingConsentOnPage([staticFixtures.statisticsConsentPurpose]);
    addProductToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectProductEvent(events[0], 1);
    });
  });

  // The Back Office switch tests come last: each one leaves a setting changed for the tests after it.
  it('customer adding a product should not be tracked when add_to_cart is switched off in the Back Office', (): void => {
    applyEventSettings({ isAddToCartEnabled: false, isRemoveFromCartEnabled: true });
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    trackingPage.grantTrackingConsent([staticFixtures.statisticsConsentPurpose]);
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();
    cartPage.visit();
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

  it('customer removing a product should not be tracked when remove_from_cart is switched off in the Back Office', (): void => {
    applyEventSettings({ isAddToCartEnabled: true, isRemoveFromCartEnabled: false });
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    trackingPage.grantTrackingConsent([staticFixtures.statisticsConsentPurpose]);
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();
    openCartWithLoadedLines();
    trackingPage.waitForGoogleAnalyticsToLoad();
    cartPage.removeProduct({ sku: dynamicFixtures.product.sku });
    // The add after the removal is still tracked, so its hit shows that the hits of the removal have been sent as well.
    cartPage.quickAddToCart({ sku: dynamicFixtures.product.sku, quantity: 1 });

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expect(getEvents(recordedTraffic, ADD_TO_CART_EVENT), describeRecordedEvents(recordedTraffic)).to.have.length(2);
      expect(
        getEvents(recordedTraffic, REMOVE_FROM_CART_EVENT),
        describeRecordedEvents(recordedTraffic)
      ).to.have.length(0);
    });
  });

  // Last: it leaves consent not required until the settings are restored after the tests.
  it('customer without tracking consent should be tracked when consent is not required in the Back Office', (): void => {
    applyTrackingConsentRequirement(false);
    cy.resetYvesCookies();
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    openProductPage();
    addProductToCart();

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      expect(getEvents(recordedTraffic, ADD_TO_CART_EVENT), describeRecordedEvents(recordedTraffic)).to.have.length(1);
    });
  });

  // The cart page loads its lines with a separate request, which a busy environment answers later than the default command
  // timeout, so the lines are waited for before a test acts on them.
  function openCartWithLoadedLines(): void {
    cy.intercept('**/cart/get-cart-items*').as('cartLines');
    cartPage.visit();
    cy.wait('@cartLines', { responseTimeout: CART_LINES_TIMEOUT });
  }

  // Adding the bundle redirects to the cart: a visit of the cart before that would cancel the request that adds it.
  function addConfiguredBundleAndWaitForCartLines(): void {
    cy.intercept('**/cart/get-cart-items*').as('cartLines');
    bundleConfiguratorPage.addConfiguredBundleToCart();
    cy.wait('@cartLines', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // Adding redirects to the cart. A page visited before the cart has loaded runs beside that cart request, which then saves
  // the session it read before the visit and drops what the visit stored, e.g. the CSRF token of a form; where the
  // environment does not lock the session for every URL, the form is then rejected.
  function addProductToCartAndWaitForCartLines(): void {
    cy.intercept('**/cart/get-cart-items*').as('cartLines');
    addProductToCart();
    cy.wait('@cartLines', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // The next page visit would cancel the request that adds the product, so it waits for the request to finish.
  function addProductToCart(): void {
    cy.intercept('POST', '**/cart/add/**').as('cartAdd');
    productPage.addToCart();
    cy.wait('@cartAdd', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // The cart page of beforeEach has consent, so a page without consent is loaded before a test records any hits. The
  // browser may still send the last hits of that cart page after it left it, so a test checks the hits of its own pages.
  function startWithoutTrackingConsent(): void {
    trackingPage.removeTrackingConsent();
    cartPage.visit();
    trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
  }

  // Neither page loads gtag.js, so neither sends a hit: no add_to_cart is recorded, and no page view of the product page.
  function addProductOnUntrackedPagesAndExpectNoHits(traffic: GoogleAnalyticsTraffic): void {
    openUntrackedProductPage();
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
  }

  // Without consent gtag.js does not load, so only the adapter is waited for: once it is mounted, the orchestrator has
  // decided whether it may start.
  function openUntrackedProductPage(): void {
    catalogPage.visit();
    catalogPage.openProductPageFromSuggestions({ query: dynamicFixtures.product.sku });
    trackingPage.getGoogleAnalyticsAdapter().should('have.prop', 'isMounted', true);
  }

  function openProductPage(sku: string = dynamicFixtures.product.sku): void {
    catalogPage.visit();
    catalogPage.openProductPageFromSuggestions({ query: sku });
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // Names the recorded events in a failed count, so the failure shows what was sent instead.
  function describeRecordedEvents(traffic: GoogleAnalyticsTraffic): string {
    const eventNames = traffic.events.map((event: GoogleAnalyticsEvent): string => event.name);

    return `recorded events: ${eventNames.join(', ') || 'none'}`;
  }

  function addVariantOnProductPage(): void {
    const { url, variantAttributeKey, variantAttributeValue } = staticFixtures.variantProduct;

    productPage.visitProductDetailPage({ url });
    trackingPage.waitForGoogleAnalyticsToLoad();
    productPage.selectVariantAttribute({ attributeKey: variantAttributeKey, attributeValue: variantAttributeValue });
    // The select submits its form to the same page with the attribute in the query; rendering the variant's page can
    // outlast the default command timeout, and the address only changes once its response arrives.
    cy.location('search', { timeout: VARIANT_PAGE_TIMEOUT }).should((search: string): void => {
      expect(decodeURIComponent(search)).to.include(`attribute[${variantAttributeKey}]=`);
    });
    productPage.getSelectedVariantAttributeValue(variantAttributeKey).should('eq', variantAttributeValue);
    addProductToCart();
  }

  function addFixtureProductOnProductPage(): void {
    openProductPage();
    addProductToCart();
  }

  // A variant is reported by its abstract product: its name and brand, the selected values and the category path.
  function expectVariantProductItem(event: GoogleAnalyticsEvent): void {
    const variantProduct = staticFixtures.variantProduct;

    expect(event.items, event.name).to.have.length(1);

    const item = event.items[0];

    expect(item.id, event.name).to.equal(variantProduct.abstractSku);
    expect(item.name, event.name).to.equal(variantProduct.abstractName);
    expect(item.brand, event.name).to.equal(variantProduct.brand);
    expect(item.variant, event.name).to.equal(variantProduct.variantAttributeValue);
    expect(item.categories, event.name).to.not.be.empty;
    expect(item.customParameters[staticFixtures.concreteSkuParameter], event.name).to.equal(variantProduct.concreteSku);
  }

  function getEvents(traffic: GoogleAnalyticsTraffic, eventName: string): GoogleAnalyticsEvent[] {
    return traffic.events.filter((event: GoogleAnalyticsEvent): boolean => event.name === eventName);
  }

  function getPageViews(traffic: GoogleAnalyticsTraffic, pagePath: string): GoogleAnalyticsEvent[] {
    return getEvents(traffic, PAGE_VIEW_EVENT).filter(
      (event: GoogleAnalyticsEvent): boolean => new URL(event.parameters[PAGE_LOCATION_PARAMETER]).pathname === pagePath
    );
  }

  // The company user's shopping list of the fixtures, opened with an empty cart and Google Analytics loaded. The list comes
  // from the fixtures because the product page offers a new list only once its session cache sees the list's publish.
  function openShoppingListWithProduct(): void {
    loginAsCustomerWithEmptyCart(dynamicFixtures.companyCustomer.email);
    shoppingListPage.visit();
    shoppingListPage.openShoppingList(dynamicFixtures.shoppingList.name);
    cy.location('pathname', { timeout: SHOPPING_LIST_PAGE_TIMEOUT }).should('include', '/shopping-list/details/');
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // The customer of beforeEach is logged out first: clearing the cookies does not end its session, as the session cookie is
  // set for the storefront domain, so the login page would redirect to that customer's account instead. The logout URL is
  // visited rather than the header link clicked, so the logout does not wait for the page the test is on to finish loading.
  function loginAsCustomerWithEmptyCart(email: string): void {
    cy.visit('/logout');
    cy.resetYvesCookies();
    trackingPage.grantTrackingConsent([staticFixtures.statisticsConsentPurpose]);
    customerLoginScenario.execute({ email, password: staticFixtures.defaultPassword, withoutSession: true });
    cartPage.visit();
    cartPage.clearCartIfNotEmpty();
  }

  // The products of the slots are read from their cards: in demo data, the abstract SKU is the part of the concrete
  // SKU before the underscore, and a concrete product has the name of its abstract product.
  function openConfiguredBundleSummary(): void {
    configuredBundleProducts = [];
    bundleConfiguratorPage.visit();
    bundleConfiguratorPage.chooseTemplate(staticFixtures.configuredBundle.templateName);
    staticFixtures.configuredBundle.slots.forEach((slot): void => {
      bundleConfiguratorPage.getSlotProduct(slot).then((slotProduct: SlotProduct): void => {
        configuredBundleProducts.push({ abstractSku: slotProduct.sku.split('_')[0], abstractName: slotProduct.name });
        bundleConfiguratorPage.selectSlotProduct({ slotName: slot.slotName, productIdentifier: slotProduct.sku });
      });
    });
    bundleConfiguratorPage.goToSummary();
  }

  // An order of the product the given step adds, the fixture product by default, placed by a customer with an address and
  // opened with Google Analytics loaded.
  function openDetailsOfPlacedOrder(addOrderedProduct: () => void = addFixtureProductOnProductPage): void {
    loginAsCustomerWithEmptyCart(dynamicFixtures.reorderCustomer.email);
    addOrderedProduct();
    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.reorderCustomer.addresses.addresses[0].id_customer_address,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });
    customerOverviewPage.viewLastPlacedOrder();
    // The overview has loaded Google Analytics as well, so the order page is waited for before its own load is.
    cy.location('pathname', { timeout: CART_LINES_TIMEOUT }).should('include', ORDER_DETAILS_PATH);
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // A quote request of the fixture product that the agent has sent back, so the company user can convert it to a cart.
  // The fixtures cannot create a quote request in a given state, so it is walked there.
  function openQuoteRequestSentBackByAgent(): void {
    loginAsCompanyUserWithEmptyCart();
    openProductPage();
    addProductToCartAndWaitForCartLines();
    quoteRequestPage.createFromCart();
    quoteRequestPage.getReference().then((reference: string): void => {
      quoteRequestReference = reference;
    });
    sendQuoteRequestToAgent();

    cy.visit('/logout');
    cy.resetYvesCookies();
    agentLoginScenario.execute({
      username: dynamicFixtures.agentUser.username,
      password: staticFixtures.defaultPassword,
      withoutSession: true,
    });
    cy.then((): void => quoteRequestPage.visitAgentRevise(quoteRequestReference));
    sendQuoteRequestToCustomer();

    // The agent's cookies go first, or the customer login redirects away.
    cy.resetYvesCookies();
    loginAsCompanyUserWithEmptyCart();
    cy.then((): void => quoteRequestPage.visitDetails(quoteRequestReference));
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // The logout after it would cancel the request that hands the quote request to the agent.
  function sendQuoteRequestToAgent(): void {
    cy.intercept('GET', '**/quote-request/send-to-user/**').as('sendToAgent');
    quoteRequestPage.sendToAgent();
    cy.wait('@sendToAgent', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // The agent's form redirects to the sending: the customer login after it would cancel that request
  // and leave the quote request in progress.
  function sendQuoteRequestToCustomer(): void {
    cy.intercept('GET', '**/agent/quote-request/send-to-customer/**').as('sendToCustomer');
    quoteRequestPage.sendToCustomer();
    cy.wait('@sendToCustomer', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
  }

  // A quote request belongs to the business unit the company user works in.
  function loginAsCompanyUserWithEmptyCart(): void {
    loginAsCustomerWithEmptyCart(dynamicFixtures.companyCustomer.email);
    companyUserSelectPage.visit();
    companyUserSelectPage.selectBusinessUnit({ idCompanyUser: dynamicFixtures.companyUser.id_company_user });
  }

  // The product is reported by its abstract SKU, abstract name and brand, with the concrete SKU as a custom item parameter.
  function expectProductEvent(event: GoogleAnalyticsEvent, quantity: number): void {
    const productPrice = Number(staticFixtures.productPrice);

    expect(event.parameters['cu'], event.name).to.equal(staticFixtures.currency);
    expect(Number(event.parameters['epn.value']), event.name).to.equal(productPrice * quantity);
    expect(event.items, event.name).to.have.length(1);

    const item = event.items[0];

    expect(item.id, event.name).to.equal(dynamicFixtures.product.abstract_sku);
    // The concrete product has a name of its own, so this also shows the concrete name is not sent.
    expect(item.name, event.name).to.equal(dynamicFixtures.abstractLocalizedAttributes.name);
    expect(item.name, event.name).to.not.equal(dynamicFixtures.concreteLocalizedAttributes.name);
    expectFixtureProductDetails(item, event.name);
    expect(Number(item.price), event.name).to.equal(productPrice);
    expect(Number(item.quantity), event.name).to.equal(quantity);
    expect(item.customParameters[staticFixtures.concreteSkuParameter], event.name).to.equal(
      dynamicFixtures.product.sku
    );
  }

  // A list adds several products at once: each one is reported by its abstract SKU, abstract name, brand and category
  // path, in whichever of the events its item is.
  function expectEventsReportAbstractProducts(
    events: GoogleAnalyticsEvent[],
    products: TrackedAbstractProduct[]
  ): void {
    expect(events, 'tracked events').to.not.be.empty;

    const items = events.flatMap((event: GoogleAnalyticsEvent): GoogleAnalyticsItem[] => event.items);

    products.forEach((product: TrackedAbstractProduct): void => {
      const item = items.find((candidate: GoogleAnalyticsItem): boolean => candidate.id === product.abstractSku);

      expect(item, product.abstractSku).to.not.equal(undefined);
      expect(item?.name, product.abstractSku).to.equal(product.abstractName);
      expectDemoProductDetails(item as GoogleAnalyticsItem, product);
    });
  }

  // The fixture product has a brand, but a single concrete product and no category, so it has no variant or category path to report.
  function expectFixtureProductDetails(item: GoogleAnalyticsItem, message: string): void {
    expect(item.brand, message).to.equal(dynamicFixtures.abstractLocalizedAttributes.attributes.brand);
    expect(item.variant, message).to.be.empty;
    expect(item.categories, message).to.be.empty;
  }

  // Every demo data product the tests add has a brand and is in a category.
  function expectDemoProductDetails(item: GoogleAnalyticsItem, product: TrackedAbstractProduct): void {
    if (product.brand === undefined) {
      expect(item.brand, product.abstractSku).to.not.be.empty;
    } else {
      expect(item.brand, product.abstractSku).to.equal(product.brand);
    }

    expect(item.categories, product.abstractSku).to.not.be.empty;
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

  // Consent is required by default; an environment that switched it off gets it back after the tests.
  function requireTrackingConsent(): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.trackingConsentTab);
    readOriginalSetting(staticFixtures.consentRequiredSetting);
    applyTrackingConsentRequirement(true);
  }

  function applyTrackingConsentRequirement(isConsentRequired: boolean): void {
    loginToBackoffice();
    configurationPage.visitIntegrationsTab(staticFixtures.trackingConsentTab);
    configurationPage.setBooleanSetting(staticFixtures.consentRequiredSetting, isConsentRequired);
    saveConfiguration();

    trackingPage.waitForTrackingConsentRequirement(isConsentRequired);
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

interface EventSettingsParams {
  isAddToCartEnabled: boolean;
  isRemoveFromCartEnabled: boolean;
}
