import { Customer, Product, Quote } from './shared';

export interface CommentsSuite1DynamicFixtures {
  customer: Customer;
  product: Product;
  quote: Quote;
  emptyQuote: Quote;
}

export interface CommentsSuite1StaticFixtures {
  defaultPassword: string;
  commentsToAdd: string[];
  commentToModify: string;
  modifiedComment: string;
  commentsToRemove: string;
}
