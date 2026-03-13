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
