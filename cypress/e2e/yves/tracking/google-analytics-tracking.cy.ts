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
  it('company user converting a quote request to the cart should be tracked with add_to_cart', (): void => {
    openQuoteRequestSentBackByAgent();
    const traffic = trackingPage.recordGoogleAnalyticsTraffic();

    cy.then((): void => quoteRequestPage.convertToCart(quoteRequestReference));

    cy.wrap(traffic, { timeout: GOOGLE_ANALYTICS_HIT_TIMEOUT }).should((recordedTraffic: GoogleAnalyticsTraffic) => {
      const events = getEvents(recordedTraffic, ADD_TO_CART_EVENT);

      expect(events, describeRecordedEvents(recordedTraffic)).to.have.length(1);
      expectEventsReportAbstractProducts(events, [
        {
          abstractSku: dynamicFixtures.product.abstract_sku,
          abstractName: dynamicFixtures.abstractLocalizedAttributes.name,
        },
      ]);
    });
  });

  // The Back Office switch tests come last: each one leaves an event switched off for the tests after it.
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

  // The next page visit would cancel the request that adds the product, so it waits for the request to finish.
  function addProductToCart(): void {
    cy.intercept('POST', '**/cart/add/**').as('cartAdd');
    productPage.addToCart();
    cy.wait('@cartAdd', { requestTimeout: CART_LINES_TIMEOUT, responseTimeout: CART_LINES_TIMEOUT });
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

  function getEvents(traffic: GoogleAnalyticsTraffic, eventName: string): GoogleAnalyticsEvent[] {
    return traffic.events.filter((event: GoogleAnalyticsEvent): boolean => event.name === eventName);
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

  // An order of the fixture product, placed by a customer with an address, opened with Google Analytics loaded.
  function openDetailsOfPlacedOrder(): void {
    loginAsCustomerWithEmptyCart(dynamicFixtures.reorderCustomer.email);
    openProductPage();
    addProductToCart();
    checkoutScenario.execute({
      idCustomerAddress: dynamicFixtures.reorderCustomer.addresses.addresses[0].id_customer_address,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });
    customerOverviewPage.viewLastPlacedOrder();
    trackingPage.waitForGoogleAnalyticsToLoad();
  }

  // A quote request of the fixture product that the agent has sent back, so the company user can convert it to a cart.
  // The fixtures cannot create a quote request in a given state, so it is walked there.
  function openQuoteRequestSentBackByAgent(): void {
    loginAsCompanyUserWithEmptyCart();
    openProductPage();
    addProductToCart();
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

  // The product is reported by its abstract SKU and abstract name, with the concrete SKU as a custom item parameter; no brand, variant or category is sent.
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
    expectNoProductDetails(item, event.name);
    expect(Number(item.price), event.name).to.equal(productPrice);
    expect(Number(item.quantity), event.name).to.equal(quantity);
    expect(item.customParameters[staticFixtures.concreteSkuParameter], event.name).to.equal(
      dynamicFixtures.product.sku
    );
  }

  // A list adds several products at once: each one is reported by its abstract SKU and abstract name, in whichever of
  // the events its item is.
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
      expectNoProductDetails(item as GoogleAnalyticsItem, product.abstractSku);
    });
  }

  // The cart events of this feature report neither the brand, nor the variant, nor the category path of a product.
  function expectNoProductDetails(item: GoogleAnalyticsItem, message: string): void {
    expect(item.brand, message).to.be.empty;
    expect(item.variant, message).to.be.empty;
    expect(item.categories, message).to.be.empty;
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
