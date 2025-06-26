import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductClassRepository {
  getProductClassSelectSelector = (): string => '[data-qa="product-classes"]';
  getProductClassOptionSelector = (value: string): string =>
    `[data-qa="product-classes"] option[value="${value}"]`;
  getSaveButtonSelector = (): string => '[name="product_concrete_form_edit"] [value="Save"]';
  getSuccessMessageSelector = (): string => '.flash-messages .alert-success';
  getVariantsTab = (): Cypress.Chainable => cy.get('[data-tab-content-id="tab-content-variants"]');
  getVariantEditButtonSelector = (): string => 'a:contains("Edit")';

  getVariantFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSiblingSelector = (): string => 'span';
  getSelect2Selector = (): string => 'ul.select2-selection__rendered';
  getSelect2ChoiceItemSelector = (): string => 'li.select2-selection__choice';
  getSelectedTypeVerificationSelector = (): string =>
    `${this.getProductClassSelectSelector()} ~ ${this.getSiblingSelector()} ${this.getSelect2Selector()} ${this.getSelect2ChoiceItemSelector()}`;
}
