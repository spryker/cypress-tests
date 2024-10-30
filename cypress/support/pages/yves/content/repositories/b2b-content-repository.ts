import { injectable } from 'inversify';
import { ContentRepository } from '../content-repository';

@injectable()
export class B2bContentRepository implements ContentRepository {
  search(query: string): void {
    cy.get('[name="q"]').first().clear().invoke('val', query);
  }
  getFirstSuggestedCmsPage = (cmsPageName: string): Cypress.Chainable =>
    cy.get(`h6:contains("Pages")`).first().closest('div').find(`a:contains("${cmsPageName}")`).first();
}
