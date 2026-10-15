export interface CostPriceDemoStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  agent: {
    username: string;
  };
  merchant: {
    username: string;
  };
  customer: {
    email: string;
  };
  product: {
    sku: string;
  };
  merchantProduct: {
    sku: string;
  };
  quoteRequest: {
    calculatedReference: string;
    uncalculatedReference: string;
  };
}
