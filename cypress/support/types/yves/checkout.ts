import { Address, Customer, ProductConcrete, Quote, Store, User } from './shared';

export interface BasicCheckoutDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
}

export interface BasicCheckoutDmsDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  product2: ProductConcrete;
  rootUser: User;
}

export interface BasicCheckoutDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  key: string;
  name: string;
}

export interface CheckoutStaticFixtures {
  defaultPassword: string;
}

export interface SplitDeliveryStaticFixtures {
  defaultPassword: string;
  expectedShipmentCount: number;
}

export interface SplitDeliveryDynamicFixtures {
  customer: Customer;
  rootUser: User;
  product1: ProductConcrete;
  product2: ProductConcrete;
  product3: ProductConcrete;
}

export interface MinimumOrderValueStaticFixtures {
  defaultPassword: string;
}

export interface MinimumOrderValueDynamicFixtures {
  rootUser: User;
  customer: Customer;
  address: Address;
  product: ProductConcrete;
}

export interface CheckoutAuthenticationStaticFixtures {
  defaultPassword: string;
  registrationPassword: string;
  salutation: string;
}

export interface CheckoutAuthenticationDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
}

export interface CheckoutAddressManagementStaticFixtures {
  defaultPassword: string;
  discardedBillingAddress: CheckoutAddressFixture;
  orderBillingAddress: CheckoutAddressFixture;
  savedShippingAddress: CheckoutAddressFixture;
}

export interface CheckoutAddressFixture {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  company: string;
  phone: string;
}

export interface CheckoutAddressManagementDynamicFixtures {
  customer: Customer;
  address: Address;
  product1: ProductConcrete;
  rootUser: User;
}

export interface BusinessUnitAddressCheckoutStaticFixtures {
  defaultPassword: string;
  businessUnitAddressStreet: string;
}

export interface BusinessUnitAddressCheckoutDynamicFixtures {
  customer: Customer;
  companyUser: CompanyUser;
  product1: ProductConcrete;
  rootUser: User;
}

interface CompanyUser {
  id_company_user: number;
}

export interface MultiMerchantOrderStaticFixtures {
  defaultPassword: string;
  expectedShipmentCount: number;
  soldByText: string;
}

export interface MultiMerchantOrderDynamicFixtures {
  customer: Customer;
  address: Address;
  rootUser: User;
  product1: ProductConcrete;
  product2: ProductConcrete;
  product3: ProductConcrete;
  merchant1: Merchant;
  merchant2: Merchant;
  productOffer1: ProductOffer;
  productOffer2: ProductOffer;
}

interface ProductOffer {
  product_offer_reference: string;
}

interface Merchant {
  name: string;
  merchant_reference: string;
}

export interface CartApprovalProcessStaticFixtures {
  defaultPassword: string;
  waitingStatus: string;
  approvedStatus: string;
}

export interface CartApprovalProcessDynamicFixtures {
  buyer: Customer;
  approver: Customer;
  buyerAddress: Address;
  buyerCompanyUser: CompanyUserReference;
  approverCompanyUser: CompanyUserReference;
  product1: ProductConcrete;
  quote: Quote;
}

interface CompanyUserReference {
  id_company_user: number;
}

export interface QuoteRequestLifecycleStaticFixtures {
  defaultPassword: string;
  revisedItemPrice: string;
  revisedItemPriceFormatted: string;
  originalItemPriceFormatted: string;
}

export interface QuoteRequestLifecycleDynamicFixtures {
  customer: Customer;
  address: Address;
  companyUser: QuoteRequestCompanyUser;
  agentUser: User;
  product1: ProductConcrete;
  quote: Quote;
}

interface QuoteRequestCompanyUser {
  id_company_user: number;
}
