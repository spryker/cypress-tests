import { Customer, ProductConcrete, Store, User } from './shared';

export interface CustomerAuthDynamicFixtures {
  customer: Customer;
}

export interface CustomerAuthDmsDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface CustomerAuthStaticFixtures {
  defaultPassword: string;
}

export interface CustomerOverviewDynamicFixtures {
  customer: Customer;
}

export interface CustomerOverviewStaticFixtures {
  defaultPassword: string;
}

export interface CustomerAddressManagementDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface CustomerAddressManagementStaticFixtures {
  defaultPassword: string;
  newAddress: NewCustomerAddress;
  backofficeAddressCountry: string;
}

export interface NewCustomerAddress {
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  zipCode: string;
  iso2Code: string;
}

export interface CustomerProfileManagementDynamicFixtures {
  customer: Customer;
  existingCustomer: Customer;
  rootUser: User;
}

export interface CustomerProfileManagementStaticFixtures {
  defaultPassword: string;
  newPassword: string;
}

export interface NewsletterSubscriptionDynamicFixtures {
  customer: Customer;
}

export interface NewsletterSubscriptionStaticFixtures {
  defaultPassword: string;
}

export interface CustomerAuthDmsStaticFixtures {
  defaultPassword: string;
  store: Store;
}

export interface RestoreSessionAfterLoginTimeoutStaticFixtures {
  defaultPassword: string;
  lastVisitedPageUrl: string;
  customerOverviewUrl: string;
}

export interface RestoreSessionAfterLoginTimeoutDynamicFixtures {
  customer: Customer;
}

export interface GuestAccessRestrictionsDynamicFixtures {
  product: ProductConcrete;
}

export interface GuestAccessRestrictionsStaticFixtures {
  cartTotal: string;
}
