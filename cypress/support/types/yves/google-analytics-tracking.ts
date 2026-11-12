import { Customer } from './shared';

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
}

// A demo data product whose events report its abstract SKU and abstract name.
export interface TrackedAbstractProduct {
  abstractSku: string;
  abstractName: string;
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
  product: { sku: string; abstract_sku: string };
  abstractLocalizedAttributes: { name: string };
  concreteLocalizedAttributes: { name: string };
}
