import { injectable } from 'inversify';
import { ContentRepository } from '../content-repository';

@injectable()
export class SuiteContentRepository implements ContentRepository {
    search = (query: string): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first().clear().invoke('val', query);
    getFirstSuggestedCmsPage = (cmsPageName: string): Cypress.Chainable =>
        cy.get(`h6:contains("In CMS pages")`).first().closest('div').find(`a:contains("${cmsPageName}")`).first();
}
