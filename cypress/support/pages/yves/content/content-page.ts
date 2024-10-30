import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ContentRepository } from './content-repository';

@injectable()
@autoWired
export class ContentPage extends YvesPage {
  @inject(REPOSITORIES.ContentRepository) private repository: ContentRepository;

  protected PAGE_URL = '/search';

  searchCmsPageFromSuggestions = (params: SearchParams): void => {
    this.repository.search(params.query);
    this.repository.getFirstSuggestedCmsPage(params.query).click();
  };
}

interface SearchParams {
  query: string;
}
