import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerViewRepository {
  getAddNewAddressButton = (): Cypress.Chainable =>
    cy.get('[data-qa="title-action"]').find('a:contains("Add new Address")');
}
