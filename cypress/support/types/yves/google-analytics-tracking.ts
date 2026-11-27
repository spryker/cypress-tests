export interface GoogleAnalyticsTrackingStaticFixtures {
  defaultPassword: string;
  measurementId: string;
  googleAnalyticsTab: string;
  measurementIdSetting: string;
  trackingConsentTab: string;
  consentRequiredSetting: string;
  statisticsConsentPurpose: string;
  // The Back Office setting of each event by event name, e.g. { view_cart: '...:view_cart_event_enabled' }.
  eventSettings: Record<string, string>;
  concreteSkuParameter: string;
  productPrice: string;
  productPriceAfterDiscounts: string;
  currency: string;
  categoryUrl: string;
  categoryName: string;
  categoryListIdPrefix: string;
  shippingTier: string;
  paymentType: string;
}

export interface GoogleAnalyticsTrackingDynamicFixtures {
  rootUser: { username: string };
  customer: { email: string };
  address: { id_customer_address: number };
  product: { sku: string; abstract_sku: string };
  // The brand is a localized attribute of the abstract product; the fixture product has no category and no variant.
  abstractLocalizedAttributes: { name: string; attributes: { brand: string } };
  concreteLocalizedAttributes: { name: string };
}
