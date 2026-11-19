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

  // The localized name sits in a collapsed section, so the value is set without typing.
  changeProductName = (localeName: string, name: string): void => {
    this.repository.getProductNameInput(localeName).invoke('val', name);
  };

  openConfiguratorSetupTab = (): void => {
    this.repository.getConfiguratorSetupTab().click();
  };

  // The template is downloaded with the session of the logged-in user, as the link in the tab does.
  downloadConfigurationTemplate = (configuratorKey: string): Cypress.Chainable<string> =>
    this.repository
      .getConfigurationTemplateDownloadLink(configuratorKey)
      .invoke('attr', 'href')
      .then((href) => cy.request(`${Cypress.env().backofficeUrl}${String(href)}`))
      .then((response) => JSON.stringify(response.body, null, 4));

  uploadConfigurationFile = (contents: string, fileName: string): void => {
    this.repository
      .getConfigurationFileInput()
      .selectFile({ contents: Cypress.Buffer.from(contents), fileName, mimeType: 'application/json' }, { force: true });
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  getConfiguratorSetupErrors = (): Cypress.Chainable => this.repository.getConfiguratorSetupErrors();

  getConfiguratorSetupNotSavedBadge = (): Cypress.Chainable => this.repository.getConfiguratorSetupNotSavedBadge();

  getConfiguratorSetupConfiguratorKey = (): Cypress.Chainable => this.repository.getConfiguratorSetupConfiguratorKey();

  getFlashMessage = (message: string): Cypress.Chainable => this.repository.getFlashMessage(message);

  updatePrice = (newPrice: string): void => {
    this.repository.getPriceTab().click();

    this.repository.getAllPriceInputs().each(($el) => {
      cy.wrap($el).type(newPrice, { force: true });
    });

    this.repository.getSaveButton().click();
  };
}
