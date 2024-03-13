import { Customer, Product, Quote } from './shared';

export interface CartCommentsDynamicFixtures {
  customer: Customer;
  product: Product;
  quote: Quote;
  emptyQuote: Quote;
}

export interface CartCommentsStaticFixtures {
  defaultPassword: string;
  commentsToAdd: string[];
  commentToModify: string;
  modifiedComment: string;
  commentsToRemove: string;
}
