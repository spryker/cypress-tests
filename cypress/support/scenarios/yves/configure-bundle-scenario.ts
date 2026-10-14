import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BundleConfiguratorPage } from '@pages/yves';

@injectable()
@autoWired
export class ConfigureBundleScenario {
  @inject(BundleConfiguratorPage) private bundleConfiguratorPage: BundleConfiguratorPage;

  execute = (params: ExecuteParams): void => {
    this.bundleConfiguratorPage.visit();
    this.bundleConfiguratorPage.chooseTemplate(params.templateName);

    params.slotSelections.forEach((slotSelection) => this.bundleConfiguratorPage.selectSlotProduct(slotSelection));

    this.bundleConfiguratorPage.goToSummary();
    this.bundleConfiguratorPage.addConfiguredBundleToCart();
  };
}

interface ExecuteParams {
  templateName: string;
  slotSelections: SlotSelection[];
}

interface SlotSelection {
  slotName: string;
  productIdentifier: string;
}
