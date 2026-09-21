import { Company, CompanyBusinessUnit, Customer, Merchant, ProductConcrete, Url, User } from './shared';

export interface MerchantProfileUpdateDynamicFixtures {
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
}

export interface MerchantProfileUpdateStaticFixtures {
  defaultPassword: string;
}

export interface MerchantStoreStatusDynamicFixtures {
  merchantUser: User;
  merchant: Merchant;
  merchantUrlEN: Url;
  merchantProduct: ProductConcrete;
}

export interface MerchantStoreStatusStaticFixtures {
  defaultPassword: string;
}

export interface ProductVolumePricesDynamicFixtures {
  customer: Customer;
  merchantUser: User;
  merchant: Merchant;
  merchantProduct: ProductConcrete;
}

export interface ProductVolumePricesStaticFixtures {
  defaultPassword: string;
  unitPrice: string;
  volumeTier: VolumeTier;
}

interface VolumeTier {
  // The quantity from which the tier price applies, and a quantity above it that the storefront
  // is driven to.
  threshold: number;
  quantity: number;
  price: string;
}

export interface CustomerSpecificPricesDynamicFixtures {
  rootUser: User;
  merchantUser: User;
  merchant: Merchant;
  company: Company;
  businessUnit: CompanyBusinessUnit;
  companyCustomer: Customer;
  customer: Customer;
  merchantProduct: ProductConcrete;
}

export interface CustomerSpecificPricesStaticFixtures {
  defaultPassword: string;
  storeName: string;
  currency: string;
  defaultPrice: string;
  customerPrice: CustomerPrice;
}

interface CustomerPrice {
  netAmount: number;
  grossAmount: number;
  displayed: string;
}
