import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsPageCreateRepository {
  getGeneralBlock = (): Cypress.Chainable => cy.get('#tab-content-general');
  getAllCollapsedIboxButtonsSelector = (): string => '.collapsed .collapse-link';
  getAllIboxesSelector = (): string => '.ibox.nested';
  getLocalizedFieldSelector = (): string => 'input[type="text"]';
  getCreatePageButton = (): Cypress.Chainable => cy.get('form[name=cms_page]').find('[type="submit"]');
  getIsSearchableCheckbox = (): Cypress.Chainable => cy.get('#cms_page_isSearchable');
}
