import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ContentRepository } from './content-repository';

@injectable()
@autoWired
export class CmsContentPage extends YvesPage {
  @inject(REPOSITORIES.ContentRepository) private repository: ContentRepository;

  protected PAGE_URL = '/search';

  visitCmsPage = (params: VisitCmsPageParams): void => {
    cy.visit(`/${params.locale}/${params.cmsPageName}`);
  };

  findCmsPageFromSuggestions = (params: SearchParams): void => {
    this.repository.search(params.query);
    cy.intercept('**/search/suggestion**').as('searchSuggestion');
    cy.wait('@searchSuggestion').then(() => {
      this.repository.getFirstSuggestedCmsPage(params.query).click();
    });
  };
}

interface SearchParams {
  query: string;
}

interface VisitCmsPageParams {
  locale: string;
  cmsPageName: string;
}
