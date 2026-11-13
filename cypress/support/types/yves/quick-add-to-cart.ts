import { Customer, ProductConcrete } from './shared';

export interface QuickAddToCartDynamicFixtures {
  customer: Customer;

  // Repositories whose demo data carries no colour group of single-variant products build one: the card
  // of the first item offers the sibling's colour.
  productGroupFirstItem?: ProductConcrete;
  productGroupSibling?: ProductConcrete;
}

export interface QuickAddToCartStaticFixtures {
  defaultPassword: string;
  buyableProduct: SearchableProduct;
  unbuyableProduct: SearchableProduct;
  productGroup: GroupedProduct;
}

interface SearchableProduct {
  searchQuery: string;

  // What the cart line must read once the card has been quick added. A sku in most repositories, a
  // product name where that is what the demo data makes identifiable.
  cartEntry?: string;
}

interface GroupedProduct {
  // Left out where the dynamic fixtures build the group: the search and the cart line then come from there.
  searchQuery?: string;
  cartEntry?: string;

  // The colour code the swatch carries in its style, or the colour name its tooltip prints,
  // whichever the repository's theme keys the swatch by.
  swatchIdentifier: string;
}
