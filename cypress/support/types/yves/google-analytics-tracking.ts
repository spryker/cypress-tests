import { Customer } from './shared';

export interface GoogleAnalyticsTrackingStaticFixtures {
  defaultPassword: string;
  measurementId: string;
  googleAnalyticsTab: string;
  measurementIdSetting: string;
  addToCartSetting: string;
  removeFromCartSetting: string;
  trackingConsentTab: string;
  consentRequiredSetting: string;
  statisticsConsentPurpose: string;
  marketingConsentPurpose: string;
  // The settings of the list and checkout events by event name, e.g. { view_cart: '...:view_cart_event_enabled' }.
  listAndCheckoutEventSettings: Record<string, string>;
  concreteSkuParameter: string;
  productPrice: string;
  productPriceAfterDiscounts: string;
  currency: string;
  configuredBundle: {
    templateName: string;
    // A slot offers its demo products in no stable set from run to run, so a candidate is picked by its position.
    slots: Array<{ slotName: string; productPosition: number }>;
  };
  productSet: {
    name: string;
    // A demo data CMS page that embeds the same product set.
    cmsPageUrl: string;
    products: TrackedAbstractProduct[];
  };
  // Demo data products with images that the catalog search finds by their SKU.
  catalogProduct: TrackedAbstractProduct & { sku: string };
  wishlistProduct: TrackedAbstractProduct & { sku: string };
  variantProduct: {
    url: string;
    abstractSku: string;
    concreteSku: string;
    abstractName: string;
    brand: string;
    variantAttributeKey: string;
    variantAttributeValue: string;
  };
  searchResultProduct: { abstractSku: string; concreteSku: string; brand: string };
  // A quantity in a sales unit that is a fraction of a piece but whole base units, e.g. 0.25 m of a product counted in cm,
  // and the whole quantity GA4 gets for it.
  measurementUnitAdd: { quantity: number; trackedQuantity: number };
  categoryUrl: string;
  categoryName: string;
  categoryListIdPrefix: string;
  secondPageQuery: string;
  similarProductsUrl: string;
  similarProductsListId: string;
  similarProductsListName: string;
  checkoutUrl: string;
  checkoutSummaryUrl: string;
  homeUrl: string;
  shippingTier: string;
  paymentType: string;
}

// A demo data product whose events report its abstract SKU, abstract name, brand and category path.
export interface TrackedAbstractProduct {
  abstractSku: string;
  abstractName: string;
  // Unknown for a product the test reads from the page, e.g. a configured bundle slot candidate: any brand is accepted then.
  brand?: string;
}

export interface GoogleAnalyticsTrackingDynamicFixtures {
  rootUser: { username: string };
  customer: { email: string };
  // A customer with an address, who places an order to reorder from.
  reorderCustomer: Customer;
  // A Zed user with storefront agent rights, who sends the quote request back to the company user.
  agentUser: { username: string };
  // Only a company user has shopping lists and quote requests.
  companyCustomer: { email: string };
  companyUser: { id_company_user: number };
  // A shopping list of the company user holding the fixture product.
  shoppingList: { name: string };
  address: { id_customer_address: number };
  product: { sku: string; abstract_sku: string };
  // Counted in centimeters and sold in meters.
  measurementUnitProduct: { sku: string; abstract_sku: string };
  // The brand is a localized attribute of the abstract product; the fixture product has no category and no variant.
  abstractLocalizedAttributes: { name: string; attributes: { brand: string } };
  concreteLocalizedAttributes: { name: string };
}
