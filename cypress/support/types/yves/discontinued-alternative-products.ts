import { Customer, ProductConcrete, User } from './shared';

export interface DiscontinuedAlternativeProductsStaticFixtures {
  defaultPassword: string;

  // Glossary wording the wishlist row prints; a repository translating it differently overrides it here.
  discontinuedLabel: string;
  alternativeLabel: string;
}

export interface DiscontinuedAlternativeProductsDynamicFixtures {
  rootUser: User;
  customer: Customer;
  discontinuedProduct: ProductConcrete;
  substituteProduct: ProductConcrete;
  wishlistProduct: ProductConcrete;
  wishlistSubstituteProduct: ProductConcrete;
}
