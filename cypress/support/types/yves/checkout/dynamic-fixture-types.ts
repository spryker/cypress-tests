import {Product} from "./common/product";

export interface CheckoutByLoggedInCustomerDynamicFixtures {
  customer: Customer;
  productOne: Product;
  productTwo: Product;
}

export interface CheckoutByGuestCustomerDynamicFixtures {
  productOne: Product;
  productTwo: Product;
}

interface Customer {
  email: string;
}
