import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductRelationRepository } from './product-relation-repository';

@injectable()
@autoWired
export class ProductRelationPage extends BackofficePage {
  @inject(REPOSITORIES.ProductRelationRepository) private repository: ProductRelationRepository;

  protected PAGE_URL = '/product-relation-gui/create';

  // Mirrors the Codeception ProductRelationCreateRelationCest flow: set the key and
  // relation type, pick the base product from the DataTables picker, then add a
  // product_sku rule on the "Assign products" tab before saving.
  createProductRelation = (params: ProductRelationFormData): void => {
    this.visit();

    this.repository.getRelationKeyInput().clear().type(params.key);
    this.repository.getRelationTypeSelect().select(params.relationType, { force: true });

    this.selectBaseProduct(params.baseProductSearch);

    this.switchToAssignProductsTab();
    this.selectProductRule({ field: 'product_sku', operator: 'equal', value: params.relatedProductSku });

    this.switchToRelationTypeTab();
    this.repository.getSaveButton().click();
  };

  assertRelationSaved = (key: string): void => {
    cy.contains(this.repository.getEditRelationHeading(key), { timeout: 20000 }).should('be.visible');
  };

  private selectBaseProduct(search: string): void {
    this.repository.getProductSearchInput().clear().type(search);

    // Wait for the DataTables reload triggered by the filter to settle before clicking.
    this.repository.getProductTableProcessing().should('not.be.visible');
    this.repository.getSelectProductButtons().first().click();
  }

  private switchToAssignProductsTab(): void {
    this.repository.getAssignProductsTab().click();

    // The QueryBuilder rule field options load via AJAX; wait for the product_sku
    // option to exist before touching the rule (mirrors the Codeception waitForElement).
    this.repository.getRuleFieldOption(0, 'product_sku').should('exist');
  }

  private switchToRelationTypeTab(): void {
    this.repository.getRelationTypeTab().click();
  }

  private selectProductRule(rule: ProductRuleData): void {
    this.repository.getRuleFieldSelect(0).select(rule.field, { force: true });
    this.repository.getRuleOperatorSelect(0).select(rule.operator, { force: true });
    this.repository.getRuleValueInput(0).clear().type(rule.value);
  }
}

interface ProductRelationFormData {
  key: string;
  relationType: string;
  baseProductSearch: string;
  relatedProductSku: string;
}

interface ProductRuleData {
  field: string;
  operator: string;
  value: string;
}
