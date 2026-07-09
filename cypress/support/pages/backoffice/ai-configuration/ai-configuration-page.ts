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

  getFeatureNav = (feature: string): Cypress.Chainable => cy.get(this.repository.getFeatureNavSelector(feature));

  getTabNav = (feature: string, tab: string): Cypress.Chainable =>
    cy.get(this.repository.getTabNavSelector(feature, tab));

  getSaveButton = (): Cypress.Chainable => cy.get(this.repository.getSaveButtonSelector());

  getSaveBar = (): Cypress.Chainable => cy.get(this.repository.getSaveBarSelector());

  getChangesCount = (): Cypress.Chainable => cy.get(this.repository.getChangesCountSelector());

  getSettingRow = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getSettingRowSelector(settingKey));

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

  /**
   * Idempotently switches a feature's AI-vendor radio (`ai_configuration`) to the given value and persists it.
   * Visits the feature tab, and only when the target radio is not already checked does it select it and Save
   * (waiting on the config-save POST — a plain persistence call, NOT an AI provider request). Safe to call as a
   * restore/safety-net: a no-op when the value is already applied, so it never issues a needless Save.
   */
  setVendorConfiguration = (feature: string, tab: string, settingKey: string, value: string): Cypress.Chainable => {
    this.visitTab(feature, tab);

    return this.getCheckedRadioOption(settingKey).then(($checked) => {
      if (String($checked.val() ?? '') === value) {
        return;
      }

      this.selectRadioOption(settingKey, value);
      this.saveConfiguration();
      cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);
    });
  };
}
