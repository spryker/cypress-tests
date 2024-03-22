import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CatalogRepository } from './catalog-repository';

@injectable()
@autoWired
export class CatalogPage extends YvesPage {
  @inject(REPOSITORIES.CatalogRepository) private repository: CatalogRepository;

  protected PAGE_URL = '/search';

  search = (params: SearchParams): void => {
    this.repository.getSearchInput().clear().type(params.query);
    this.repository.getFirstSuggestedProduct().click();
  };
}

interface SearchParams {
  query: string;
}
