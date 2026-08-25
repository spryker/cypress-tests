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

  selectSlotProduct = (params: SelectSlotProductParams): void => {
    this.repository.getSlotButton(params.slotName).click();
    this.repository
      .getConfiguratorProduct(params.productIdentifier)
      .find(this.repository.getConfiguratorProductSelectButtonSelector())
      .first()
      .click();
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
  productIdentifier: string;
}
