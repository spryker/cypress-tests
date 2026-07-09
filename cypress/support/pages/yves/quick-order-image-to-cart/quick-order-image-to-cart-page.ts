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

  // Static, hard-coded Publish & Synchronize console command (no interpolation, no user input).
  private SYNC_CONFIGURATION_COMMAND = 'console sync:data configuration';

  /**
   * Enables the Quick Add by Image feature for the storefront. Two distinct steps are required because
   * Yves does NOT read this toggle from the database — it reads it from Redis via Publish & Synchronize
   * (`AiCommerceConfig::isQuickOrderImageToCartEnabled()` resolves `ai_commerce:quick_order:visual_add_to_cart:enabled`
   * through the Configuration client, which reads the `kv:configuration:global` Redis key):
   *
   *   1. Enable the flag through the Back Office Configuration Management UI (idempotent: only toggles
   *      when currently off). The Save action is a plain config-save POST, NOT an AI provider call.
   *   2. Propagate the saved value to Yves' Redis storage. The save enqueues a `spy_configuration_value`
   *      entity event on the `publish` queue; the queue worker processes it into
   *      `spy_configuration_storage`, and `sync:data configuration` exports that row to the
   *      `kv:configuration:global` Redis key the Yves config client reads.
   *
   * SCOPED CONSOLE-COMMAND EXCEPTION (approved): the demo Cypress group is otherwise UI-only with no
   * CLI/seeding. This spec is an explicit, approved exception (matches the Search by Image spec —
   * same storefront-read toggle mechanism) because the image-to-cart control is gated by a
   * storefront-read AI toggle that is OFF by default, and this dev/CI environment has no continuously
   * running queue worker — so a UI save alone never reaches Yves. The commands are plain P&S plumbing
   * (no data seeding, no AI provider, no token). They run server-side through the project's existing
   * `cy.runQueueWorker()` / `cy.runCliCommands()` helpers (the Glue Backend dynamic-fixtures
   * console-command endpoint), so they do not depend on `docker/sdk` being reachable from the Cypress
   * runner host.
   */
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

    // Publish & Synchronize the saved value into Yves' Redis storage (see method doc-block):
    // process the publish queue (value -> spy_configuration_storage) then sync that row to Redis.
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

  getImageToCartSection = (): Cypress.Chainable => cy.get(this.repository.getImageToCartSectionSelector());

  getImageToCartTitle = (): Cypress.Chainable => cy.get(this.repository.getImageToCartTitleSelector());

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

  // Attaches an in-memory file with the given byte size and MIME type without touching the fixtures
  // directory. Used to drive the pure client-side max-file-size branch and the server-side
  // MIME/extension validation branch with no real image and no provider call.
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

  // Posts a raw multipart image-to-cart submit with an attached non-image file, bypassing the input's
  // `accept` filter (which the browser applies to picker/selectFile). This is the only way to drive the
  // SERVER-side MIME/extension constraint branch: the browser would otherwise strip the mismatched file
  // before it ever reaches the endpoint. The CSRF token is scraped from a fresh page render so the form
  // is submitted (not CSRF-rejected) and validation is exercised on the file itself. Provider-free.
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

  // Real-AI submit: intercept WITHOUT a stub so the request reaches the live provider, then wait
  // with a generous timeout for the slow recognition round-trip. Returns the real interception so
  // the spec can assert only that a 2xx response was received (never on body semantics).
  submitImageOrderReal = (): Cypress.Chainable => {
    cy.intercept('POST', '**/quick-order').as('imageOrderSubmitReal');
    this.getUploadSubmitButton().click();

    return cy.wait('@imageOrderSubmitReal', { timeout: 30000 });
  };

  getQuickOrderRows = (): Cypress.Chainable => cy.get(this.repository.getQuickOrderRowsSelector(), { timeout: 30000 });

  getRecognizedSkuInputs = (): Cypress.Chainable =>
    cy.get(this.repository.getRecognizedSkuInputSelector(), { timeout: 30000 });
}
