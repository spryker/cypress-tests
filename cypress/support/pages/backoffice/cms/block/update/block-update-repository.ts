import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BlockUpdateRepository {
  getAllAvailableStoresInputs = (): Cypress.Chainable => cy.get('input[name="cms_block[storeRelation][id_stores][]"]');
  getSaveButton = (): Cypress.Chainable => cy.get('input[type="submit"]');
}
