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
  };

  goToSummary = (): void => {
    this.repository.getSlotButton('Summary').click();
  };

  addConfiguredBundleToCart = (): void => {
    this.repository.getAddToCartButton().click();
  };
}

interface SelectSlotProductParams {
  slotName: string;
  productIdentifier?: string;
  productPosition?: number;
}
