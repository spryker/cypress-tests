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
}

export interface GoogleAnalyticsTrackingDynamicFixtures {
  rootUser: { username: string };
  customer: { email: string };
  product: { sku: string; abstract_sku: string };
}
