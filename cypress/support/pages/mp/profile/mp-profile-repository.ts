import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class MpProfileRepository {
  getPhoneNumberInput = (): Cypress.Chainable => {
    return cy.get('#merchantProfile_businessInfoMerchantProfile_contact_person_phone');
  };

  getProfileForm = (): Cypress.Chainable => {
    return cy.get('form[name=merchantProfile]');
  };
}
