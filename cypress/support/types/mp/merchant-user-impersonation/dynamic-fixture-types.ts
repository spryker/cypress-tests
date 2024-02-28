export interface MerchantUserImpersonationDynamicFixtures {
  rootUser: User;
  merchantAgentUser: User;
  merchantUser: User;
  customer: Customer;
  productConcreteForOffer: ProductConcrete;
  productConcreteForMerchant: ProductConcrete;
  productOffer: ProductOffer;
}

interface Customer {
  email: string;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
}

interface ProductConcrete {
  sku: string;
  abstract_sku: string;
}

interface ProductOffer {
  product_offer_reference: string;
}
