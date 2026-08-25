import { Customer, ProductConcrete } from './shared';

export interface ProductLabelsDynamicFixtures {
  customer: Customer;
  labelledProduct: ProductConcrete;
}

export interface ProductLabelsStaticFixtures {
  defaultPassword: string;
  labelName: string;
}
