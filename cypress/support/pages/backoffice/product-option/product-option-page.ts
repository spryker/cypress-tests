import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductOptionRepository } from './product-option-repository';

@injectable()
@autoWired
export class ProductOptionPage extends BackofficePage {
  @inject(REPOSITORIES.ProductOptionRepository) private repository: ProductOptionRepository;

  protected PAGE_URL = '/product-option/create/index';

  private EDIT_PAGE_URL = '/product-option/edit/index?id-product-option-group=';

  visitCreatePage = (): void => {
    this.visit();
    this.assertBreadcrumb(this.repository.getCreateBreadcrumb());
  };

  visitEditPage = (idProductOptionGroup: number): void => {
    cy.visitBackoffice(`${this.EDIT_PAGE_URL}${idProductOptionGroup}`);
    this.assertBreadcrumb(this.repository.getEditBreadcrumb());
  };

  // Fills the group name, tax set and both language translation blocks for a
  // brand-new option group plus its option values (mirrors the Codeception
  // fillOptionGroupData + fillOptionValues page-object helpers).
  fillNewProductOptionGroup = (group: ProductOptionGroupFormData): void => {
    this.expandSecondTranslationBlock();

    this.repository.getGroupNameInput().clear().type(group.name);
    this.repository.getTaxSetSelect().select(group.taxSet, { force: true });
    this.repository.getGroupNameTranslationInput(0).clear().type('Option value translation in first language');
    this.repository.getGroupNameTranslationInput(1).clear().type('Option value translation in second language');

    this.fillOptionValues(group.values);
  };

  // Reproduces the Codeception "translation copy" assertion: typing into the
  // first language input and clicking the copy button must mirror the value
  // into the second language input.
  assertGroupNameTranslationCopied = (): void => {
    const translationToCopy = 'Translated value';

    this.repository.getGroupNameTranslationInput(0).clear().type(translationToCopy);
    this.repository.getTranslationCopyButton().click();
    this.repository.getGroupNameTranslationInput(1).should('have.value', translationToCopy);
  };

  changeTaxSet = (taxSet: string): void => {
    this.repository.getTaxSetSelect().select(taxSet, { force: true });
  };

  assertTaxSet = (taxSet: string): void => {
    this.repository.getTaxSetSelect().should('have.value', taxSet);
  };

  focusFirstOptionValueGrossAmount = (): void => {
    this.repository.getOptionValueGrossAmountInput(0, 0).click();
  };

  updateFirstOptionValuePrice = (netAmount: string, grossAmount: string): void => {
    this.repository.getOptionValueNetAmountInput(0, 0).clear().type(netAmount);
    this.repository.getOptionValueGrossAmountInput(0, 0).clear().type(grossAmount);
  };

  assertFirstOptionValuePrice = (netAmount: string, grossAmount: string): void => {
    this.repository.getOptionValueNetAmountInput(0, 0).should('have.value', netAmount);
    this.repository.getOptionValueGrossAmountInput(0, 0).should('have.value', grossAmount);
  };

  // Assigns the first two catalog products then removes the first assignment,
  // mirroring the Codeception assignProducts()/unassignProduct() helpers that
  // drive the DataTables product picker.
  assignFirstTwoProductsThenUnassignOne = (): void => {
    this.assignFirstTwoProducts();
    this.unassignFirstAssignedProduct();
  };

  submitForm = (): void => {
    this.repository.getSubmitButton().click();
  };

  assertGroupCreatedSuccessMessage = (): void => {
    cy.contains(this.repository.getProductCreatedSuccessMessage()).should('be.visible');
  };

  assertGroupModifiedSuccessMessage = (): void => {
    cy.contains(this.repository.getGroupModifiedSuccessMessage()).should('be.visible');
  };

  assertOptionActivatedSuccessMessage = (): void => {
    this.repository.getAssignedProductsListItem().click(20, 20);
    this.repository.getAssignedTab().click();

    this.repository.getProductOptionTableRowCells().should('have.length.at.least', 2);
    this.repository.getProductOptionTableRowCells().each(($cell) => {
      expect(parseInt($cell.text().trim(), 10)).to.be.greaterThan(0);
    });

    this.repository.getActivateButton().click();
    this.repository.getActivateSuccessContainer().should('be.visible');
    cy.contains(this.repository.getOptionActivatedSuccessMessage()).should('be.visible');
  };

  private assertBreadcrumb(breadcrumb: string): void {
    cy.contains(breadcrumb).should('be.visible');
  }

  private expandSecondTranslationBlock(): void {
    this.repository.getExpandSecondTranslationBlockLink().click();
  }

  private fillOptionValues(values: ProductOptionValueFormData[]): void {
    values.forEach((value, index) => {
      const elementNr = index + 1;

      if (index > 0) {
        this.repository.getAddAnotherOptionButton().click();
      }

      this.repository.getOptionValueInput(elementNr).clear().type(value.value);
      this.repository.getOptionValueSkuInput(elementNr).clear().type(value.sku);

      value.prices.forEach((price, currencyIndex) => {
        this.repository.getOptionValueNetAmountInput(elementNr, currencyIndex).clear().type(price.netAmount);
        this.repository.getOptionValueGrossAmountInput(elementNr, currencyIndex).clear().type(price.grossAmount);
      });
    });

    const numberOfTranslations = values.length * 2;
    for (let i = 1; i <= numberOfTranslations; i++) {
      this.repository.getOptionValueTranslationInput(i).clear().type('Option value translation');
    }
  }

  private assignFirstTwoProducts(): void {
    this.selectProductTab();
    this.repository.getDataTableProcessing().should('not.be.visible');

    const productIds: string[] = [];
    this.repository
      .getProductTableRowCell(1)
      .invoke('text')
      .then((text) => {
        productIds.push(text.trim());
      });
    this.repository
      .getProductTableRowCell(2)
      .invoke('text')
      .then((text) => {
        productIds.push(text.trim());
      });

    cy.then(() => {
      productIds.forEach((idProduct) => {
        this.repository.getAllProductsCheckbox(idProduct).click();
      });
    });

    this.repository.getDataTableProcessing().should('not.be.visible');
  }

  private unassignFirstAssignedProduct(): void {
    this.repository.getProductsToBeAssignedTab().click();
    this.repository
      .getSelectedProductRowCell()
      .invoke('text')
      .then((text) => {
        this.repository.getUnassignProductLink(text.trim()).click();
      });
  }

  private selectProductTab(): void {
    // The sticky topbar overlaps the products tab; hide it so the click lands
    // (mirrors the Codeception executeJS that hides '.app-topbar').
    this.repository.getTopbar().invoke('css', 'display', 'none');
    this.repository.getProductTab().click();
  }
}

interface ProductOptionGroupFormData {
  name: string;
  taxSet: string;
  values: ProductOptionValueFormData[];
}

interface ProductOptionValueFormData {
  value: string;
  sku: string;
  prices: ProductOptionValuePriceFormData[];
}

interface ProductOptionValuePriceFormData {
  netAmount: string;
  grossAmount: string;
}
