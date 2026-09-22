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

  // A store-scoped url is only known at run time, because the store switcher owns the
  // prefix; callers derive it from the switcher instead of hard-coding a store path.
  visitCmsPageUrl = (cmsPageUrl: string): void => {
    cy.visit(cmsPageUrl);
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
