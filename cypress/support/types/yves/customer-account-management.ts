import { Customer, Store, User } from './shared';

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
}

export interface CustomerAddressManagementStaticFixtures {
  defaultPassword: string;
}

export interface CustomerProfileManagementDynamicFixtures {
  customer: Customer;
  existingCustomer: Customer;
}

export interface CustomerProfileManagementStaticFixtures {
  defaultPassword: string;
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
