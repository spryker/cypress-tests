import { injectable } from 'inversify';
import { ContentRepository } from '../content-repository';

@injectable()
export class B2cContentRepository implements ContentRepository {
  search(query: string): void {
    cy.get('header .header__search-open').click();
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[name="q"]').first().clear().invoke('val', query);
  }
  getFirstSuggestedCmsPage = (cmsPageName: string): Cypress.Chainable =>
    cy.get(`h4:contains("Pages")`).first().closest('div').find(`a:contains("${cmsPageName}")`).first();
  // The shop prefixes every cms page url with the language of its locale (CmsConfig::appendPrefixToCmsPageUrl).
  getCmsPageUrlPath = (cmsPageName: string, localeName: string): string =>
    `/${localeName.split('_')[0].toLowerCase()}/${cmsPageName}`;
}
