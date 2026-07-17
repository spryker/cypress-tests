import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsBlockCreateRepository {
  getBreadcrumbs = (): Cypress.Chainable => cy.get('spryker-breadcrumbs');
  getNameInput = (): Cypress.Chainable => cy.get('#cms_block_name');
  getSaveButton = (): Cypress.Chainable => cy.get('form[name="cms_block"]').find('[type="submit"]');
  getSuccessMessage = (): string => 'CMS Block was created successfully.';
}
