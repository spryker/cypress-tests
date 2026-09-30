export interface CatalogBrowsingStaticFixtures {
  searchTerm: string;
  colorFilter: FacetSelection;

  // Substrings of the facet headings the catalog has to offer; the full wording differs per theme.
  filterTitles: string[];
  ascendingPriceSortLabel: string;
  descendingPriceSortLabel: string;
}

interface FacetSelection {
  name: string;
  value: string;
}
