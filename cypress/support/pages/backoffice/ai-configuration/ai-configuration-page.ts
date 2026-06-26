import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { AiConfigurationRepository } from './ai-configuration-repository';

@injectable()
@autoWired
export class AiConfigurationPage extends BackofficePage {
  @inject(REPOSITORIES.AiConfigurationRepository) private repository: AiConfigurationRepository;

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

  getSettingRow = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getSettingRowSelector(settingKey));

  getSettingInput = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSettingInputSelector(settingKey));

  getJsonEditor = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getJsonEditorSelector(settingKey));

  getCheckedRadioOption = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getRadioOptionSelector(settingKey)).filter(':checked');

  getRadioOptions = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getRadioOptionSelector(settingKey));
}
