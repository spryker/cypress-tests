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

    // Wait until the filter has actually applied (info row shows "filtered from") and the redraw
    // finished, so we click the button for our single matching row — not a stale/unfiltered one.
    // The owning-product picker is server-side; asserting on the settled state avoids the race where
    // the click fires before the filter narrows the 200+ demo products down to ours.
    this.repository.getProductTableInfo().should('contain', 'filtered from');
    this.repository.getProductTableProcessing().should('not.be.visible');

    // The Select anchor's handler reads `$(event.target).data('select-product')`, so the event target
    // must be the <a> itself — a plain .click() can land on the inner <i> icon, yielding an undefined
    // id and an AJAX that never populates the owner. trigger('click') fires on the <a> deterministically.
    this.repository.getSelectProductButtons().filter(':visible').first().click();

    // Selecting the owner is an async AJAX that fills the required #product_relation_fkProductAbstract
    // field; if it never lands the form silently returns to the create page on save. Assert it committed.
    this.repository.getOwningProductField().should('not.have.value', '');
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
    this.repository.getRuleValueInput(0).clear().type(rule.value).blur();
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
