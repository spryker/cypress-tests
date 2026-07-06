import { injectable } from 'inversify';
import { DiscountRepository } from '../discount-repository';

@injectable()
export class B2bDiscountRepository implements DiscountRepository {
  getTypeSelect(): Cypress.Chainable {
    return cy.get('#discount_discountGeneral_discount_type');
  }

  getNameInput(): Cypress.Chainable {
    return cy.get('#discount_discountGeneral_display_name');
  }

  getDescriptionInput(): Cypress.Chainable {
    return cy.get('#discount_discountGeneral_description');
  }

  getExclusiveRadio(isExclusive: boolean): Cypress.Chainable {
    return cy.get(`#discount_discountGeneral_is_exclusive_${isExclusive ? 1 : 0}`);
  }

  getValidFromInput(): Cypress.Chainable {
    return cy.get('#discount_discountGeneral_valid_from');
  }

  getValidToInput(): Cypress.Chainable {
    return cy.get('#discount_discountGeneral_valid_to');
  }

  getCalculatorPluginSelect(): Cypress.Chainable {
    return cy.get('#discount_discountCalculator_calculator_plugin');
  }

  getGrossAmountInput(): Cypress.Chainable {
    return cy.get('#discount_discountCalculator_moneyValueCollection_0_gross_amount');
  }

  getCalculationGetButton(): Cypress.Chainable {
    return cy.get('#btn-calculation-get');
  }

  getCollectorQueryStringInput(): Cypress.Chainable {
    return cy.get('#discount_discountCalculator_collector_query_string');
  }

  getConditionGetButton(): Cypress.Chainable {
    return cy.get('#btn-condition-get');
  }

  getDecisionRuleQueryStringInput(): Cypress.Chainable {
    return cy.get('#discount_discountCondition_decision_rule_query_string');
  }

  getCreateButton(): Cypress.Chainable {
    return cy.get('#create-discount-button');
  }

  getTabLink(tabContentId: string): Cypress.Chainable {
    return cy.get(`.tabs-container ul li[data-tab-content-id="${tabContentId}"] a`);
  }

  getActiveTabError(): Cypress.Chainable {
    return cy.get('.nav-tabs li.active.error');
  }

  getSuccessAlert(): Cypress.Chainable {
    return cy.get('div.alert-success');
  }

  getNameErrorContainer(): Cypress.Chainable {
    return cy.get('.has-error');
  }

  getListTable(): Cypress.Chainable {
    return cy.get('.dt-container');
  }

  getDecisionRuleContainerSelector(): string {
    return '[data-qa=decision-rule]';
  }

  getListTableUrl(): string {
    return '**/discount/index/list-table**';
  }

  getEditActionSelector(): string {
    return 'a:contains("Edit")';
  }

  getViewActionSelector(): string {
    return 'a:contains("View")';
  }

  getDeactivateActionSelector(): string {
    return ':contains("Deactivate")';
  }

  getHeadingSelector(): string {
    return 'h2';
  }

  getSuccessMessage(): string {
    return 'Discount successfully created, but not activated.';
  }

  getBlankValueError(): string {
    return 'This value should not be blank';
  }

  getEditHeading(): string {
    return 'Edit discount';
  }

  getViewHeading(): string {
    return 'View discount';
  }
}
