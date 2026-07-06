import { injectable } from 'inversify';
import { ProductRelationRepository } from '../product-relation-repository';

@injectable()
export class B2bMpProductRelationRepository implements ProductRelationRepository {
  getRelationKeyInput(): Cypress.Chainable {
    return cy.get('#product_relation_productRelationKey');
  }

  getRelationTypeSelect(): Cypress.Chainable {
    return cy.get('#product_relation_productRelationType');
  }

  getProductSearchInput(): Cypress.Chainable {
    return cy.get('.dt-search input');
  }

  getProductTableProcessing(): Cypress.Chainable {
    return cy.get('#product-table_processing');
  }

  getSelectProductButtons(): Cypress.Chainable {
    return cy.get('[id^="select-product-"]');
  }

  getAssignProductsTab(): Cypress.Chainable {
    return cy.get('#form-product-relation ul li:nth-child(2) a');
  }

  getRelationTypeTab(): Cypress.Chainable {
    return cy.get('[data-qa="tab-relation-type"]');
  }

  getRuleFieldSelect(ruleIndex: number): Cypress.Chainable {
    return cy.get(`#builder_rule_${ruleIndex} div:nth-child(3) select`);
  }

  getRuleFieldOption(ruleIndex: number, value: string): Cypress.Chainable {
    return cy.get(`#builder_rule_${ruleIndex} div:nth-child(3) select option[value="${value}"]`);
  }

  getRuleOperatorSelect(ruleIndex: number): Cypress.Chainable {
    return cy.get(`#builder_rule_${ruleIndex} div:nth-child(4) select`);
  }

  getRuleValueInput(ruleIndex: number): Cypress.Chainable {
    return cy.get(`#builder_rule_${ruleIndex} div:nth-child(5) input`);
  }

  getSaveButton(): Cypress.Chainable {
    return cy.get('#submit-relation');
  }

  getEditRelationHeading(key: string): string {
    return `Edit Product Relation: ${key}`;
  }
}
