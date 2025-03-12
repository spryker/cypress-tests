import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ProductManagementListPage } from '@pages/backoffice';
import { ProductAbstractTypeRepository } from './product-abstract-type-repository';

@injectable()
@autoWired
export class ProductAbstractTypePage extends BackofficePage {
  @inject(ProductAbstractTypeRepository) private repository: ProductAbstractTypeRepository;
  @inject(ProductManagementListPage) private productListPage: ProductManagementListPage;

  selectProductAbstractType(typeValue: string): void {
    cy.get(this.repository.getProductAbstractTypeSelectSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSelect2Selector())
      .should('exist')
      .click();
    
    // Then select the option from the dropdown by clicking on it
    cy.get('li.select2-results__option')
      .contains(typeValue)
      .click();
  }

  saveProductAbstract(): void {
    cy.get(this.repository.getSaveButtonSelector())
      .should('exist')
      .click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('exist')
      .should('be.visible')
      .should('contain', 'was saved successfully.');
  }
  
  verifyProductAbstractTypeSelected(typeName: string): void {
    cy.get(this.repository.getSelectedTypeVerificationSelector())
      .should('contain', typeName);
  }

  editProductFromList(sku: string): void {
    cy.contains('tr', sku).then(($row) => {
      this.productListPage.clickEditAction($row);
    });
  }
}
