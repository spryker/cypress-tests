import {Product} from "./common/product";

export interface CreateOrderByCustomerDynamicFixtures {
  customer: Customer;
  product: Product;
}

export interface CreateOrderByGuestDynamicFixtures {
  product: Product;
}

interface Customer {
  email: string;
}
