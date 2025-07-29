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
      .should('exist')
      .click();

    // Then select the option from the dropdown by clicking on it
    cy.get('li.select2-results__option').contains(typeValue).click();
  }

  selectShipmentType(shipmentName: string): void {
    this.repository.getShipmentTypeSelectSelect()
        .siblings(this.repository.getSiblingSelector())
        .find(this.repository.getSelect2Selector())
        .should('exist')
        .click();

      cy.get('li.select2-results__option').contains(shipmentName).click();
  }

  saveProduct(): void {
    cy.get(this.repository.getSaveButtonSelector()).should('exist').click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('exist')
      .should('be.visible')
      .should('contain', 'was saved successfully.');
  }

  verifyProductClassSelected(typeName: string): void {
    cy.get(this.repository.getSelectedTypeVerificationSelector()).should('contain', typeName);
  }

  verifyShipmentTypeSelected(shipmentTypeName: string): void {
    cy.get(this.repository.getShipmentTypeVerificationSelector()).should('contain', shipmentTypeName);
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
    this.repository.getVariantFirstTableRow().then(($productVariantRow) => {
      cy.wrap($productVariantRow).find(this.repository.getVariantEditButtonSelector()).as('editVariantButton');
      cy.get('@editVariantButton').should('be.visible').click({ force: true });
    });
  }
}
