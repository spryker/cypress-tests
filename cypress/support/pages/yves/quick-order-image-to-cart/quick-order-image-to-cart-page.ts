import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { QuickOrderImageToCartRepository } from './quick-order-image-to-cart-repository';

@injectable()
@autoWired
export class QuickOrderImageToCartPage extends YvesPage {
  @inject(QuickOrderImageToCartRepository) private repository: QuickOrderImageToCartRepository;

  protected PAGE_URL = '/quick-order';

  private CONFIGURATION_URL = '/configuration/manage?feature=ai_commerce&tab=quick_order';

  private SYNC_CONFIGURATION_COMMAND = 'console sync:data configuration';

  enableQuickAddByImage = (): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (!($toggle[0] as HTMLInputElement).checked) {
        cy.wrap($toggle).check({ force: true });

        cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
        cy.get(this.repository.getSaveButtonSelector()).click();
        cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
      }
    });

    cy.get(this.repository.getEnableToggleSelector()).should('be.checked');

    cy.runQueueWorker();
    cy.runCliCommands([this.SYNC_CONFIGURATION_COMMAND]);

    return cy.get(this.repository.getEnableToggleSelector()).should('be.checked');
  };

  visitQuickOrder = (): Cypress.Chainable => {
    cy.intercept('GET', '**/quick-order').as('quickOrderDocument');
    this.visit();

    return cy.wait('@quickOrderDocument');
  };

  getPageTitle = (): Cypress.Chainable => cy.get(this.repository.getPageTitleSelector());

  getPageTitleText = (): string => this.repository.getPageTitleText();

  getImageToCartSection = (): Cypress.Chainable => cy.get(this.repository.getImageToCartSectionSelector());

  getImageToCartTitle = (): Cypress.Chainable => cy.get(this.repository.getImageToCartTitleSelector());

  getImageToCartTitleText = (): string => this.repository.getImageToCartTitleText();

  getBrowseFileText = (): string => this.repository.getBrowseFileText();

  getUploadButtonText = (): string => this.repository.getUploadButtonText();

  getImageUploadInputName = (): string => this.repository.getImageUploadInputName();

  getAcceptedImageMimeTypes = (): string => this.repository.getAcceptedImageMimeTypes();

  getImageUploadInput = (): Cypress.Chainable => cy.get(this.repository.getImageUploadInputSelector());

  getBrowseFileLabel = (): Cypress.Chainable => cy.get(this.repository.getBrowseFileLabelSelector());

  getUploadSubmitButton = (): Cypress.Chainable => cy.get(this.repository.getUploadSubmitButtonSelector());

  getFileSelectLabel = (): Cypress.Chainable => cy.get(this.repository.getFileSelectLabelSelector());

  getBrowseFileToggleLabel = (): Cypress.Chainable => cy.get(this.repository.getBrowseFileToggleLabelSelector());

  getErrorDropzone = (): Cypress.Chainable => cy.get(this.repository.getErrorDropzoneSelector());

  getErrorMessage = (): Cypress.Chainable => cy.get(this.repository.getErrorMessageSelector());

  getFileSelectError = (): Cypress.Chainable => cy.get(this.repository.getFileSelectErrorSelector());

  getRemoveFileIcon = (): Cypress.Chainable => cy.get(this.repository.getRemoveFileIconSelector());

  attachImage = (imageFilePath: string): Cypress.Chainable =>
    this.getImageUploadInput().selectFile(imageFilePath, { force: true });

  attachSyntheticFile = (params: { fileName: string; sizeInBytes: number; mimeType: string }): Cypress.Chainable =>
    this.getImageUploadInput().selectFile(
      {
        contents: Cypress.Buffer.alloc(params.sizeInBytes),
        fileName: params.fileName,
        mimeType: params.mimeType,
      },
      { force: true }
    );

  removeAttachedFile = (): Cypress.Chainable => this.getRemoveFileIcon().click({ force: true });

  submitEmptyImageOrder = (): Cypress.Chainable => {
    cy.intercept('POST', '**/quick-order').as('emptyImageOrderSubmit');
    this.getUploadSubmitButton().click();

    return cy.wait('@emptyImageOrderSubmit');
  };

  submitNonImageFileViaRequest = (params: {
    fileName: string;
    contents: string;
    mimeType: string;
  }): Cypress.Chainable => {
    const pageUrl = this.PAGE_URL;

    return cy
      .visit(pageUrl)
      .get(this.repository.getImageOrderCsrfTokenSelector())
      .invoke('attr', 'value')
      .then((csrfToken) => {
        const formData = new FormData();
        formData.append(
          'image_order_form[uploadImageOrder]',
          new Blob([params.contents], { type: params.mimeType }),
          params.fileName
        );
        formData.append('image_order_form[_token]', String(csrfToken));
        formData.append('uploadImage', '');

        return cy.window().then(
          (win) =>
            new Cypress.Promise((resolve) => {
              const xhr = new win.XMLHttpRequest();
              xhr.open('POST', pageUrl);
              xhr.onload = (): void => resolve({ status: xhr.status, body: xhr.responseText });
              xhr.send(formData);
            })
        );
      });
  };

  submitImageOrder = (): Cypress.Chainable => {
    cy.intercept('POST', '**/quick-order').as('imageOrderSubmit');
    this.getUploadSubmitButton().click();

    return cy.wait('@imageOrderSubmit');
  };

  submitImageOrderReal = (): Cypress.Chainable => {
    cy.intercept('POST', '**/quick-order').as('imageOrderSubmitReal');
    this.getUploadSubmitButton().click();

    return cy.wait('@imageOrderSubmitReal', { timeout: 30000 });
  };

  getQuickOrderRows = (): Cypress.Chainable => cy.get(this.repository.getQuickOrderRowsSelector(), { timeout: 30000 });

  getRecognizedSkuInputs = (): Cypress.Chainable =>
    cy.get(this.repository.getRecognizedSkuInputSelector(), { timeout: 30000 });
}
