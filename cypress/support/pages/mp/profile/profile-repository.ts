import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProfileRepository {
  getPhoneNumberInput = (): Cypress.Chainable =>
    cy.get('#merchantProfile_businessInfoMerchantProfile_contact_person_phone');

  getProfileForm = (): Cypress.Chainable => cy.get('form[name=merchantProfile]');

  // The portal paints its tabs from the Angular bundle after the page load, so this waits like
  // every other control on the page rather than on the default timeout.
  getOnlineProfileTab = (): Cypress.Chainable =>
    cy.contains('button.ant-tabs-tab-btn', 'Online Profile', { timeout: 20000 });

  getPublicEmailInput = (): Cypress.Chainable => cy.get('#merchantProfile_onlineProfileMerchantProfile_public_email');

  getPublicPhoneInput = (): Cypress.Chainable => cy.get('#merchantProfile_onlineProfileMerchantProfile_public_phone');

  // The glossary attributes render one fieldset per locale; index 0 is the first configured locale.
  getDeliveryTimeInput = (localeIndex: number): Cypress.Chainable =>
    cy.get(
      `#merchantProfile_onlineProfileMerchantProfile_merchantProfileLocalizedGlossaryAttributes_${localeIndex}_merchantProfileGlossaryAttributeValues_deliveryTimeGlossaryKey`
    );

  getDataPrivacyTextarea = (localeIndex: number): Cypress.Chainable =>
    cy.get(
      `#merchantProfile_onlineProfileMerchantProfile_merchantProfileLocalizedGlossaryAttributes_${localeIndex}_merchantProfileGlossaryAttributeValues_dataPrivacyGlossaryKey`
    );

  getStoreStatusCheckbox = (): Cypress.Chainable => cy.get('#merchantProfile_onlineProfileMerchantProfile_is_active');

  getSaveButton = (): Cypress.Chainable => cy.contains('button', 'Save');

  getLocalizedFieldsetCount = (): Cypress.Chainable =>
    cy.get('[id*="merchantProfileLocalizedGlossaryAttributes"][id$="deliveryTimeGlossaryKey"]');
}
