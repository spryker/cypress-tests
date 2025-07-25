import { ProductConcrete } from './shared';

export interface LocaleSwitchingDynamicFixtures {
  product: ProductConcrete;
}

export interface LocaleSwitchingStaticFixtures {
  localeDE: string;
  localeEN: string;
  availableLocales: string[];
  newPageLinkEN: string;
  newPageLinkDE: string;
  storeCodeDE: string;
  storeCodeAT: string;
  languageCodeDE: string;
  languageCodeEN: string;
}
