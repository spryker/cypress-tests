export interface ProductDetailVisibilityStaticFixtures {
  customer: StaticCustomer;
  product: VariantProductWithOptions;
}

interface StaticCustomer {
  email: string;
  password: string;
}

interface VariantProductWithOptions {
  url: string;
  variantAttribute: VariantAttribute;
  optionGroupLabels: string[];
}

interface VariantAttribute {
  key: string;
  value: string;
}
