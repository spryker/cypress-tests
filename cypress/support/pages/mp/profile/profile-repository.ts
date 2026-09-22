import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProfileRepository {
  getPhoneNumberInput = (): Cypress.Chainable =>
    cy.get('#merchantProfile_businessInfoMerchantProfile_contact_person_phone');

  getProfileForm = (): Cypress.Chainable => cy.get('form[name=merchantProfile]');

  // Nothing on this page exists until its Angular component upgrades, which it marks with
  // ng-version. It is the largest form in the portal and under CI load the upgrade takes
  // appreciably longer than any single control's own timeout allows, so it is waited for on its
  // own rather than through whichever descendant is wanted next.
  getUpgradedProfile = (): Cypress.Chainable => cy.get('web-mp-profile[ng-version]', { timeout: 60000 });

  getProfileTabs = (): Cypress.Chainable => cy.get('button.ant-tabs-tab-btn', { timeout: 20000 });

  getOnlineProfileTabLabel = (): string => 'Online Profile';

  getOnlineProfileTab = (): Cypress.Chainable =>
    cy.contains('button.ant-tabs-tab-btn', this.getOnlineProfileTabLabel(), { timeout: 20000 });

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
