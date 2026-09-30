import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class GlobalThresholdRepository {
  getStoreCurrencySelect = (): Cypress.Chainable => cy.get('#global-threshold_storeCurrency');

  getMinimumValueInput = (): Cypress.Chainable => cy.get('#global-threshold_hardThreshold_threshold');

  getMinimumMessageInput = (locale: string): Cypress.Chainable =>
    cy.get(`#global-threshold_hardThreshold_${locale}_message`);

  getMaximumValueInput = (): Cypress.Chainable => cy.get('#global-threshold_hardMaximumThreshold_threshold');

  getMaximumMessageInput = (locale: string): Cypress.Chainable =>
    cy.get(`#global-threshold_hardMaximumThreshold_${locale}_message`);

  getSoftValueInput = (): Cypress.Chainable => cy.get('#global-threshold_softThreshold_threshold');

  getSoftMessageInput = (locale: string): Cypress.Chainable =>
    cy.get(`#global-threshold_softThreshold_${locale}_message`);

  getSoftFixedFeeInput = (): Cypress.Chainable => cy.get('#global-threshold_softThreshold_fixedFee');

  // The strategies render as an expanded ChoiceType, so each option is a radio whose only stable
  // handle is the label text the form-expander plugin returns.
  getSoftStrategyRadio = (label: string): Cypress.Chainable => cy.contains('label', label).find('input[type="radio"]');

  getSubmitButton = (): Cypress.Chainable => cy.get('input[type="submit"].safe-submit');

  getSuccessMessage = (): string => 'The Global Thresholds is saved successfully.';
}
