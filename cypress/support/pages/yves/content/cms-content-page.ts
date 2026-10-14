import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { ContentRepository } from './content-repository';

// Store codes are upper case (/AT), language prefixes lower case (/en).
const LANGUAGE_PATH_SUFFIX = /\/[a-z]{2}$/;

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

  // The classic B2B store switcher lands on the bare store prefix while the other themes land on the
  // store and language prefix, and a cms page url always carries the language.
  getCmsPageUrlOnCurrentStore = (params: VisitCmsPageOnCurrentStoreParams): Cypress.Chainable<string> => {
    const language = params.localeName.split('_')[0];

    return cy.url().then((currentUrl: string) => {
      const storeUrl = currentUrl.split('?')[0].replace(/\/$/, '');
      const storeLanguageUrl = LANGUAGE_PATH_SUFFIX.test(storeUrl) ? storeUrl : `${storeUrl}/${language}`;

      return `${storeLanguageUrl}/${params.cmsPageName}`;
    });
  };

  visitCmsPageOnCurrentStore = (params: VisitCmsPageOnCurrentStoreParams): void => {
    this.getCmsPageUrlOnCurrentStore(params).then((cmsPageUrl: string) => cy.visit(cmsPageUrl));
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

interface VisitCmsPageOnCurrentStoreParams {
  cmsPageName: string;
  localeName: string;
}
