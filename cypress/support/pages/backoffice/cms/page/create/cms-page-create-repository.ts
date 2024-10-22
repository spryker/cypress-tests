import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsPageCreateRepository {
  getCollapsedIboxButton = (): Cypress.Chainable =>
    cy.get('#tab-content-general > .panel-body > .collapsed .collapse-link');

  getCreatePageButton = (): Cypress.Chainable => cy.get('form[name=cms_page]').find('[type="submit"]');

  getDeNameInput = (): Cypress.Chainable => cy.get('#cms_page_pageAttributes_0_name');
  getDeUrlInput = (): Cypress.Chainable => cy.get('#cms_page_pageAttributes_0_url');
  getEnNameInput = (): Cypress.Chainable => cy.get('#cms_page_pageAttributes_1_name');
  getEnUrlInput = (): Cypress.Chainable => cy.get('#cms_page_pageAttributes_1_url');
  getIsSearchableCheckbox = (): Cypress.Chainable => cy.get('#cms_page_isSearchable');
}
