import { Customer, Product, User, Store } from './shared';

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  rootUser: User;
}

export interface PublishAndSynchronizeDmsStaticFixtures {
    defaultPassword: string;
    customer: Customer;
    rootUser: User;

    store: Store;
    product: Product;
    warehouse1: string;
    warehouse2: string;
    paymentMethod: string;
    productPrice: string;
    shipmentMethod: string;
}
