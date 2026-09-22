import { Customer, User } from '../yves/shared';

export interface ProductLifecycleManagementStaticFixtures {
  defaultPassword: string;
}

export interface ProductLifecycleManagementDynamicFixtures {
  rootUser: User;
  customer: Customer;
}
