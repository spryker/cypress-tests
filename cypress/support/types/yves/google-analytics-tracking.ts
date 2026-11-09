export interface GoogleAnalyticsTrackingStaticFixtures {
  defaultPassword: string;
  measurementId: string;
  googleAnalyticsTab: string;
  measurementIdSetting: string;
  addToCartSetting: string;
  removeFromCartSetting: string;
  concreteSkuParameter: string;
  productPrice: string;
  currency: string;
  configuredBundle: {
    templateName: string;
    slots: Array<TrackedAbstractProduct & { slotName: string; sku: string }>;
  };
  productSet: {
    name: string;
    products: TrackedAbstractProduct[];
  };
  // Demo data products with images that the catalog search finds by their SKU.
  catalogProduct: TrackedAbstractProduct & { sku: string };
  wishlistProduct: TrackedAbstractProduct & { sku: string };
}

// A demo data product whose events report its abstract SKU and abstract name.
export interface TrackedAbstractProduct {
  abstractSku: string;
  abstractName: string;
}

export interface GoogleAnalyticsTrackingDynamicFixtures {
  rootUser: { username: string };
  customer: { email: string };
  // Only a company user has shopping lists.
  companyCustomer: { email: string };
  // A shopping list of the company user holding the fixture product.
  shoppingList: { name: string };
  product: { sku: string; abstract_sku: string };
  abstractLocalizedAttributes: { name: string };
  concreteLocalizedAttributes: { name: string };
}
