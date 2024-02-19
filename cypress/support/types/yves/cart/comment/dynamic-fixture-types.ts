import {Quote} from "./common/quote";
import {Product} from "./common/product";


export interface CartCommentDynamicFixtures {
  quote: Quote;
  customer: Customer;
  product: Product;
}

interface Customer {
  email: string;
}
