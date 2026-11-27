import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ProductManagementEditVariantRepository } from './product-management-edit-variant-repository';

@injectable()
@autoWired
export class ProductManagementEditVariantPage extends BackofficePage {
  @inject(ProductManagementEditVariantRepository) private repository: ProductManagementEditVariantRepository;

  protected PAGE_URL = '/product-management/edit/variant';

  activate = (): void => {
    this.repository.getActivateButton().click();
    this.repository.getCollapsedBlock().click();
    this.repository.getSearchableDECheckbox().check();
    this.repository.getSearchableENCheckbox().check();

    this.repository.getPriceStockTab().click();
    this.repository.getIsNeverOutOfStockCheckbox().check();

    this.repository.getSaveButton().click();
  };

  deactivate = (): void => {
    this.repository.getDeactivateButton().click();
  };

  visitVariant = (idProductConcrete: number, idProductAbstract: number): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id-product=${idProductConcrete}&id-product-abstract=${idProductAbstract}`);
  };

  getProductNameInput = (localeName: string): Cypress.Chainable => this.repository.getProductNameInput(localeName);

  changeProductName = (localeName: string, name: string): void => {
    this.repository.getProductNameInput(localeName).invoke('val', name);
  };

  openConfiguratorSetupTab = (): void => {
    this.repository.getConfiguratorSetupTab().click();
  };

  getConfiguratorSetupStatus = (): Cypress.Chainable => this.repository.getConfiguratorSetupStatus();

  getConfigurationTemplateDownloadLink = (configuratorKey: string): Cypress.Chainable =>
    this.repository.getConfigurationTemplateDownloadLink(configuratorKey);

  getSavedConfigurationDownloadUnavailableButton = (): Cypress.Chainable =>
    this.repository.getSavedConfigurationDownloadUnavailableButton();

  requestConfigurationTemplateDownload = (configuratorKey: string): Cypress.Chainable<Cypress.Response<unknown>> =>
    this.repository
      .getConfigurationTemplateDownloadLink(configuratorKey)
      .invoke('attr', 'href')
      .then((href) => cy.request(`${Cypress.env().backofficeUrl}${String(href)}`));

  downloadConfigurationTemplate = (configuratorKey: string): Cypress.Chainable<string> =>
    this.requestConfigurationTemplateDownload(configuratorKey).then((response) =>
      JSON.stringify(response.body, null, 4)
    );

  downloadSavedConfiguration = (): Cypress.Chainable<Cypress.Response<unknown>> =>
    this.repository
      .getSavedConfigurationDownloadLink()
      .invoke('attr', 'href')
      .then((href) => cy.request(`${Cypress.env().backofficeUrl}${String(href)}`));

  uploadConfigurationFile = (contents: string, fileName: string): void => {
    this.repository
      .getConfigurationFileInput()
      .selectFile({ contents: Cypress.Buffer.from(contents), fileName, mimeType: 'application/json' }, { force: true });
  };

  dropConfigurationFile = (contents: string, fileName: string, mimeType: string): void => {
    this.repository
      .getConfigurationFileDropArea()
      .selectFile({ contents: Cypress.Buffer.from(contents), fileName, mimeType }, { action: 'drag-drop' });
  };

  getConfigurationFileList = (): Cypress.Chainable => this.repository.getConfigurationFileList();

  getConfigurationFileMessage = (): Cypress.Chainable => this.repository.getConfigurationFileMessage();

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  getConfiguratorSetupErrors = (): Cypress.Chainable => this.repository.getConfiguratorSetupErrors();

  getConfiguratorSetupNotSavedBadge = (): Cypress.Chainable => this.repository.getConfiguratorSetupNotSavedBadge();

  getConfiguratorSetupEmptySummary = (): Cypress.Chainable => this.repository.getConfiguratorSetupEmptySummary();

  getConfiguratorSetupConfiguratorKey = (): Cypress.Chainable => this.repository.getConfiguratorSetupConfiguratorKey();

  getConfiguratorSetupSummaryItems = (): Cypress.Chainable => this.repository.getConfiguratorSetupSummaryItems();

  getConfiguratorSetupLastChange = (): Cypress.Chainable => this.repository.getConfiguratorSetupLastChange();

  openConfigurableProductSummarySections = (): void => {
    this.repository.getConfigurableProductSummaryGroupsToggle().click();
    this.repository.getConfigurableProductSummaryRulesToggle().click();
  };

  getConfigurableProductSummaryGroupLabels = (): Cypress.Chainable =>
    this.repository.getConfigurableProductSummaryGroupLabels();

  getConfigurableProductSummaryRuleTexts = (): Cypress.Chainable =>
    this.repository.getConfigurableProductSummaryRuleTexts();

  getFlashMessage = (message: string): Cypress.Chainable => this.repository.getFlashMessage(message);

  updatePrice = (newPrice: string): void => {
    this.repository.getPriceTab().click();

    this.repository.getAllPriceInputs().each(($el) => {
      cy.wrap($el).type(newPrice, { force: true });
    });

    this.repository.getSaveButton().click();
  };
}
