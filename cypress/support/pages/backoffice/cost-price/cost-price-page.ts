import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CostPriceRepository } from './cost-price-repository';

@injectable()
@autoWired
export class CostPricePage extends BackofficePage {
  @inject(REPOSITORIES.CostPriceRepository) private repository: CostPriceRepository;

  protected PAGE_URL = '/product-management';

  visitProductEdit = (idProductAbstract: number): Cypress.Chainable => {
    cy.intercept('GET', '**/product-management/edit?id-product-abstract=*').as('productEditDocument');
    cy.visitBackoffice(`${this.PAGE_URL}/edit?id-product-abstract=${idProductAbstract}`);

    return cy.wait('@productEditDocument');
  };

  visitProductView = (idProductAbstract: number): Cypress.Chainable => {
    cy.intercept('GET', '**/product-management/view?id-product-abstract=*').as('productViewDocument');
    cy.visitBackoffice(`${this.PAGE_URL}/view?id-product-abstract=${idProductAbstract}`);

    return cy.wait('@productViewDocument');
  };

  getPriceTable = (): Cypress.Chainable => cy.get(this.repository.getPriceTableSelector());

  getPriceTableHeaders = (): Cypress.Chainable => cy.get(this.repository.getPriceTableHeaderSelector());

  getCostAmountInputs = (): Cypress.Chainable => cy.get(this.repository.getCostAmountInputSelector());

  getPriceTaxWidget = (): Cypress.Chainable =>
    cy.get(this.repository.getPriceTaxWidgetSelector()).contains('Price & Taxes');

  getCostPriceViewRow = (): Cypress.Chainable =>
    cy.get(this.repository.getCostPriceViewRowSelector()).filter(':contains("Cost price")');
}
