import { injectable } from 'inversify';
import { ContentRepository } from '../content-repository';

@injectable()
export class B2bCatalogRepository implements ContentRepository {
  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] input').first();
  getFirstSuggestedCmsPage = (cmsPageName: string): Cypress.Chainable =>
    cy.get(`a:contains("${cmsPageName}")`).first();  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="component search-form"] [type="submit"]:visible');
}
