import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CategoryEditRepository {
  getStoreSelect = (): Cypress.Chainable => cy.get('#category_store_relation_id_stores');
  getSaveButton = (): Cypress.Chainable => cy.get('button.safe-submit');
}
