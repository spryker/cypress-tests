import { Customer, Quote } from './shared';

export interface CartCustomOrderReferenceDynamicFixtures {
  customer: Customer;
  quote: Quote;
}

export interface CartCustomOrderReferenceStaticFixtures {
  defaultPassword: string;
  reference: string;
}
