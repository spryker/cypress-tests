import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductAbstractTypeRepository {
  getProductAbstractTypeSelectSelector = (): string => '[data-qa="product-abstract-types"]';
  getProductAbstractTypeOptionSelector = (value: string): string => `[data-qa="product-abstract-types"] option[value="${value}"]`;
  getSaveButtonSelector = (): string => '[name="product_form_edit"] [value="Save"]';
  getSuccessMessageSelector = (): string => '.flash-messages .alert-success';
  getSiblingSelector = (): string => 'span';
  getSelect2Selector = (): string => 'ul.select2-selection__rendered';
  getSelect2ChoiceItemSelector = (): string => 'li.select2-selection__choice';
  getSelectedTypeVerificationSelector = (): string => `${this.getProductAbstractTypeSelectSelector()} ~ ${this.getSiblingSelector()} ${this.getSelect2Selector()} ${this.getSelect2ChoiceItemSelector()}`;
}
