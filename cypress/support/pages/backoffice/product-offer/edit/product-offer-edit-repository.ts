import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductOfferEditRepository {
  // Rendered as a Select2 combo box, so the native multi-select behind it is hidden and every
  // interaction with it has to be forced.
  getStoresField = (): Cypress.Chainable => cy.get('[name="edit_offer_form[stores][]"]');

  // The submit control carries no type attribute; it is the form's default submit button.
  getSaveButton = (): Cypress.Chainable => cy.get('[name="edit_offer_form"]').find('button.safe-submit');
}
