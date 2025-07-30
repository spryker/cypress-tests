import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProfileRepository {
  getPhoneNumberInput = (): Cypress.Chainable =>
    cy.get('#merchantProfile_businessInfoMerchantProfile_contact_person_phone');

  getProfileForm = (): Cypress.Chainable => cy.get('form[name=merchantProfile]');
}
