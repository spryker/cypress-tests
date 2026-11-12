import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { BundleConfiguratorRepository } from './bundle-configurator-repository';

@injectable()
@autoWired
export class BundleConfiguratorPage extends YvesPage {
  @inject(BundleConfiguratorRepository) private repository: BundleConfiguratorRepository;

  protected PAGE_URL = '/configurable-bundle/configurator/template-selection';

  chooseTemplate = (templateName: string): void => {
    this.repository.getTemplateName(templateName).parents(this.repository.getTemplateLinkSelector()).first().click();
    this.repository.getConfiguratorSidebar().should('be.visible');
  };

  // A candidate is picked by the text or sku its card carries or, where a shop's slot offers its demo products in no
  // stable set from run to run, by its position in the slot's list.
  selectSlotProduct = (params: SelectSlotProductParams): void => {
    this.repository.getSlotButton(params.slotName).click();

    const configuratorProduct =
      params.productIdentifier !== undefined
        ? this.repository.getConfiguratorProduct(params.productIdentifier).first()
        : this.repository.getConfiguratorProducts().eq(params.productPosition ?? 0);

    configuratorProduct.find(this.repository.getConfiguratorProductSelectButtonSelector()).first().click();

    // The selection reloads the page: a click on the next slot before that would cancel it.
    if (params.productIdentifier !== undefined) {
      this.repository.getSelectedConfiguratorProduct(params.productIdentifier);
    }
  };

  // Reads the candidate at a position of a slot's list from its card.
  getSlotProduct = (params: GetSlotProductParams): Cypress.Chainable<SlotProduct> => {
    this.repository.getSlotButton(params.slotName).click();
    // Opening a slot reloads the page: the cards before that are the previous slot's.
    this.repository.getActiveSlotButton(params.slotName);

    return this.repository
      .getConfiguratorProducts()
      .eq(params.productPosition)
      .then(
        ($configuratorProduct: JQuery<HTMLElement>): SlotProduct => ({
          // The card's form also carries the products of the other slots: the card's own sku comes last.
          sku: String($configuratorProduct.find(this.repository.getConfiguratorProductSkuInputSelector()).last().val()),
          name: $configuratorProduct.find(this.repository.getConfiguratorProductNameSelector()).first().text().trim(),
        })
      );
  };

  goToSummary = (): void => {
    this.repository.getSlotButton('Summary').click();
  };

  addConfiguredBundleToCart = (): void => {
    this.repository.getAddToCartButton().click();
  };
}

interface GetSlotProductParams {
  slotName: string;
  productPosition: number;
}

export interface SlotProduct {
  sku: string;
  name: string;
}

interface SelectSlotProductParams {
  slotName: string;
  productIdentifier?: string;
  productPosition?: number;
}
