import { Customer, Merchant } from './shared';

export interface CatalogFiltersStaticFixtures {
  defaultPassword: string;
  searchTerm: string;
  colorFilter: FacetSelection;

  // Substrings of the facet headings the catalog has to offer; the full wording differs per theme.
  filterTitles: string[];
  ascendingPriceSortLabel: string;
  descendingPriceSortLabel: string;

  // Only in the marketplace shops; the storefront names the merchant facet after its product-document field.
  merchantFilterName: string;
}

export interface CatalogFiltersDynamicFixtures {
  customer: Customer;

  // Only in the marketplace shops: two merchants each offering a product of the same name.
  localizedAttribute: LocalizedAttribute;
  merchant2: Merchant;
}

interface FacetSelection {
  name: string;
  value: string;
}

interface LocalizedAttribute {
  name: string;
}
