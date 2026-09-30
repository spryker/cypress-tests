import { Address, Customer, ProductConcrete, Quote, User } from './shared';

export interface CartCommentsDynamicFixtures {
  customer: Customer;
  product1: ProductConcrete;
  quote: Quote;
  emptyQuote: Quote;
  rootUser: User;
}

export interface CartCommentsStaticFixtures {
  defaultPassword: string;
  commentsToAdd: string[];
  commentToModify: string;
  modifiedComment: string;
  commentsToRemove: string;
  commentToKeepThroughCheckout: string;
}

export interface OrderCommentsDynamicFixtures {
  customer: Customer;
  address: Address;
  product: ProductConcrete;
  rootUser: User;
}

export interface OrderCommentsStaticFixtures {
  defaultPassword: string;
  commentOnOrder: string;
}
