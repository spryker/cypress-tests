import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AiConfigurationRepository } from './ai-configuration-repository';

@injectable()
@autoWired
export class AiConfigurationPage extends BackofficePage {
  @inject(AiConfigurationRepository) private repository: AiConfigurationRepository;

  protected PAGE_URL = '/configuration/manage';

  visitTab = (feature: string, tab: string): Cypress.Chainable => {
    cy.intercept('GET', '**/configuration/manage**').as('configurationDocument');
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${feature}&tab=${tab}`);

    return cy.wait('@configurationDocument');
  };

  getCardTitle = (): Cypress.Chainable => cy.get(this.repository.getCardTitleSelector());

  getCardTitleText = (): string => this.repository.getCardTitleText();

  getVendorSettingKey = (vendor: string, field: string): string => this.repository.getVendorSettingKey(vendor, field);

  getApiTokenSettingInput = (vendor: string): Cypress.Chainable =>
    cy.get(this.repository.getApiTokenSettingInputSelector(vendor));

  getModelPricesEditor = (vendor: string): Cypress.Chainable =>
    cy.get(this.repository.getModelPricesEditorSelector(vendor));

  getFeatureNav = (feature: string): Cypress.Chainable => cy.get(this.repository.getFeatureNavSelector(feature));

  getTabNav = (feature: string, tab: string): Cypress.Chainable =>
    cy.get(this.repository.getTabNavSelector(feature, tab));

  getSaveButton = (): Cypress.Chainable => cy.get(this.repository.getSaveButtonSelector());

  getSaveBar = (): Cypress.Chainable => cy.get(this.repository.getSaveBarSelector());

  getChangesCount = (): Cypress.Chainable => cy.get(this.repository.getChangesCountSelector());

  getSettingRow = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getSettingRowSelector(settingKey));

  getSettingRows = (groupKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSettingRowsByGroupSelector(groupKey));

  getSettingInput = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSettingInputSelector(settingKey));

  getJsonEditor = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getJsonEditorSelector(settingKey));

  getCheckedRadioOption = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getRadioOptionSelector(settingKey)).filter(':checked');

  getRadioOptions = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getRadioOptionSelector(settingKey));

  selectRadioOption = (settingKey: string, value: string): Cypress.Chainable =>
    cy.get(this.repository.getRadioOptionByValueSelector(settingKey, value)).check({ force: true });

  setSettingInputValue = (settingKey: string, value: string): Cypress.Chainable =>
    this.getSettingInput(settingKey).clear().type(value).blur();

  saveConfiguration = (): void => {
    cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
    this.getSaveButton().click();
  };

  hasApiToken = (vendor: string): Cypress.Chainable<boolean> => {
    this.visitTab('ai_vendor', vendor);

    return this.getApiTokenSettingInput(vendor)
      .invoke('val')
      .then((token) => String(token ?? '') !== '');
  };

  setBooleanSetting = (feature: string, tab: string, settingKey: string, isEnabled: boolean): Cypress.Chainable => {
    this.visitTab(feature, tab);

    return this.getSettingInput(settingKey).then(($input) => {
      if (($input[0] as HTMLInputElement).checked === isEnabled) {
        return;
      }

      cy.wrap($input)[isEnabled ? 'check' : 'uncheck']({ force: true });
      this.saveConfiguration();
      // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Post-action guard: the setter must not return before the save round-trip succeeds.
      cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);
    });
  };

  getFeatureVendorSettingKey = (feature: string): string => this.repository.getFeatureVendorSettingKey(feature);

  getFeatureVendorOptionValue = (feature: string, vendor: string): string =>
    this.repository.getFeatureVendorOptionValue(feature, vendor);

  setFeatureVendor = (feature: string, vendor: string): Cypress.Chainable =>
    this.setVendorConfiguration(
      'ai_commerce',
      feature,
      this.getFeatureVendorSettingKey(feature),
      this.getFeatureVendorOptionValue(feature, vendor)
    );

  setVendorConfiguration = (feature: string, tab: string, settingKey: string, value: string): Cypress.Chainable => {
    this.visitTab(feature, tab);

    return this.getCheckedRadioOption(settingKey).then(($checked) => {
      if (String($checked.val() ?? '') === value) {
        return;
      }

      this.selectRadioOption(settingKey, value);
      this.saveConfiguration();
      // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Post-action guard: the setter must not return before the save round-trip succeeds.
      cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);
    });
  };
}
