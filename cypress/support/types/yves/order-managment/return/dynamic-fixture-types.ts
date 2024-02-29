import { Product } from './common/product';

export interface CreateReturnByUserDynamicFixtures {
  rootUser: User;
  customer: Customer;
  product: Product;
  quoteOne: Quote;
  quoteTwo: Quote;
}

interface User {
  username: string;
}

interface Customer {
  email: string;
}

interface Quote {
  name: string;
}
