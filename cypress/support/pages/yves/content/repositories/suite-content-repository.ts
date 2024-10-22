import { injectable } from 'inversify';
import { ContentRepository } from '../content-repository';

@injectable()
export class SuiteContentRepository implements ContentRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
    getFirstSuggestedCmsPage = (cmsPageName: string): Cypress.Chainable =>
        cy.get(`h6:contains("In CMS pages")`).first().closest('div').find(`a:contains("${cmsPageName}")`).first();
}
