import { Customer, ProductConcrete, ProductOffer, User } from './shared';
import { Address } from '../backoffice/shared';

export interface MarketplaceOrderManagementSmokeStaticFixtures {
  defaultPassword: string;
  rootUser: User;
  merchantUser: User;
  customer: Customer;
  address: Address;
  productConcreteForOffer: ProductConcrete;
  productOffer: ProductOffer;
}
