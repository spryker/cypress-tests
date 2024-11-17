import { Customer, User } from './shared';
import {Product, Store} from "../backoffice/shared";

export interface PublishAndSynchronizeStaticFixtures {
  defaultPassword: string;
}

export interface PublishAndSynchronizeDynamicFixtures {
  customer: Customer;
  rootUser: User;
}

export interface PublishAndSynchronizeDmsStaticFixtures {
    defaultPassword: string;
    store: Store;
    product: Product;
    warehouse1: string;
    warehouse2: string;
    productPrice: string;
    shipmentMethod: string;
}

export interface PublishAndSynchronizeDmsDynamicFixtures {
    rootUser: User;
    customer: Customer;
}
