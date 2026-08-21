import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ProductManagementListPage } from '@pages/backoffice';
import { ProductRepository } from './product-repository';

@injectable()
@autoWired
export class ProductPage extends BackofficePage {
  @inject(ProductRepository) private repository: ProductRepository;
  @inject(ProductManagementListPage) private productListPage: ProductManagementListPage;

  selectProductClass(typeValue: string): void {
    cy.get(this.repository.getProductClassSelectSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSelect2Selector())
      .click();

    // Then select the option from the dropdown by clicking on it
    cy.get('li.select2-results__option').contains(typeValue).click();
  }

  selectShipmentType(shipmentName: string): void {
    this.repository
      .getShipmentTypeSelectSelect()
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSelect2Selector())
      .click();

    cy.get('li.select2-results__option').contains(shipmentName).click();
  }

  saveProduct(): void {
    cy.get(this.repository.getSaveButtonSelector()).click();
  }

  getSuccessMessage(): Cypress.Chainable {
    return cy.get(this.repository.getSuccessMessageSelector());
  }

  getSelectedProductClass(): Cypress.Chainable {
    return cy.get(this.repository.getSelectedTypeVerificationSelector());
  }

  getSelectedShipmentType(): Cypress.Chainable {
    return cy.get(this.repository.getShipmentTypeVerificationSelector());
  }

  editProductFromList(sku: string): void {
    cy.contains('tr', sku).then(($row) => {
      this.productListPage.clickEditAction($row);
    });
  }

  goToVariansTab(): void {
    this.repository.getVariantsTab().click();
  }

  editFirstVariant(): void {
    this.repository
      .getVariantFirstTableRow()
      .find(this.repository.getVariantEditButtonSelector())
      .click({ force: true });
  }
}
