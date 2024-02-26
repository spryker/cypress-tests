import {Quote} from "./common/quote";
import {Product} from "./common/product";

export interface DynamicFixtures {
  quote: Quote;
  customer: Customer;
  product: Product;
}

interface Customer {
  email: string;
}
