import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SmartCmsRepository } from './smart-cms-repository';

@injectable()
@autoWired
export class SmartCmsPage extends BackofficePage {
  @inject(SmartCmsRepository) private repository: SmartCmsRepository;

  protected PAGE_URL = '/cms-gui/create-glossary?id-cms-page=6';

  private CONFIGURATION_URL = '/configuration/manage?feature=ai_commerce&tab=smart_cms';

  private CMS_BLOCK_EDITOR_URL = '/cms-block-gui/edit-glossary?id-cms-block=24';

  /**
   * Enables the Smart CMS feature flag via the Configuration Management UI and saves.
   * Idempotent: only checks the toggle when it is currently off, so a re-run on an already-enabled
   * env still ends in the ON state. The Save action triggers a plain config-save POST
   * (`/configuration/manage/save`) — NOT an AI provider call.
   */
  enableSmartCms = (): Cypress.Chainable => this.setSmartCmsEnabled(true);

  disableSmartCms = (): Cypress.Chainable => this.setSmartCmsEnabled(false);

  /**
   * Sets the Smart CMS feature flag via the Configuration Management UI and saves when the toggle
   * needs to change. Idempotent: only saves on an actual state change, so a re-run leaves the flag
   * in the requested state. The Save action triggers a plain config-save POST
   * (`/configuration/manage/save`) — NOT an AI provider call.
   */
  private setSmartCmsEnabled = (enabled: boolean): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (($toggle[0] as HTMLInputElement).checked === enabled) {
        return;
      }

      cy.wrap($toggle)[enabled ? 'check' : 'uncheck']({ force: true });

      cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
      cy.get(this.repository.getSaveButtonSelector()).click();
      cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
    });

    return cy.get(this.repository.getEnableToggleSelector()).should(enabled ? 'be.checked' : 'not.be.checked');
  };

  visitCmsPageEditor = (): Cypress.Chainable => {
    cy.intercept('GET', '**/cms-gui/create-glossary**').as('cmsPageEditorDocument');
    cy.visitBackoffice(this.PAGE_URL);

    return cy.wait('@cmsPageEditorDocument');
  };

  visitCmsBlockEditor = (): Cypress.Chainable => {
    cy.intercept('GET', '**/cms-block-gui/edit-glossary**').as('cmsBlockEditorDocument');
    cy.visitBackoffice(this.CMS_BLOCK_EDITOR_URL);

    return cy.wait('@cmsBlockEditorDocument');
  };

  getPanel = (): Cypress.Chainable => cy.get(this.repository.getPanelSelector());

  getPanelCollapsedClass = (): string => this.repository.getPanelCollapsedClass();

  getPanelToggle = (): Cypress.Chainable => cy.get(this.repository.getPanelToggleSelector());

  getPanelInput = (): Cypress.Chainable => cy.get(this.repository.getPanelInputSelector());

  getPanelAsk = (): Cypress.Chainable => cy.get(this.repository.getPanelAskSelector());

  getPanelAttach = (): Cypress.Chainable => cy.get(this.repository.getPanelAttachSelector());

  getPanelAttachmentName = (): Cypress.Chainable => cy.get(this.repository.getPanelAttachmentNameSelector());

  getPanelAttachmentRemove = (): Cypress.Chainable => cy.get(this.repository.getPanelAttachmentRemoveSelector());

  getGlossaryEditor = (): Cypress.Chainable => cy.get(this.repository.getGlossaryEditorSelector());

  getPanelMessage = (): Cypress.Chainable => cy.get(this.repository.getPanelMessageSelector());

  expandPanel = (): void => {
    this.getPanelToggle().click();
    this.getPanelInput().should('be.visible');
  };

  typePrompt = (prompt: string): void => {
    this.getPanelInput().clear().type(prompt).should('have.value', prompt);
  };

  attachFile = (file: string | Cypress.FileReference): void => {
    cy.get(this.repository.getPanelFileInputSelector()).selectFile(file, { force: true });
  };

  attachUnsupportedFile = (mediaType: string): void => {
    this.attachFile({
      contents: Cypress.Buffer.from('MZ unsupported binary'),
      fileName: 'unsupported.bin',
      mimeType: mediaType,
    });
  };

  interceptGenerateWithProviderFailure = (): void => {
    cy.intercept('POST', this.repository.getGenerateEndpointGlob(), {
      statusCode: 503,
      body: { error: 'AI provider unavailable' },
    }).as('generateRequest');
  };

  interceptRealGenerate = (): void => {
    cy.intercept('POST', this.repository.getGenerateEndpointGlob()).as('generateRequest');
  };

  clickAskAi = (): void => {
    this.getPanelAsk().click();
  };

  removeFirstAttachment = (): void => {
    this.getPanelAttachmentRemove().first().click();
  };

  getPanelSuccessMessage = (): Cypress.Chainable => cy.get(this.repository.getPanelSuccessMessageSelector());

  /**
   * Reads the CSRF token the editor page injected into `window.SmartCmsContentConfig`, so an
   * authenticated `cy.request` can pass the guard that rejects a missing/invalid token.
   */
  getInjectedCsrfToken = (): Cypress.Chainable<string> =>
    cy
      .window()
      .then((win) =>
        String(
          (win as unknown as { SmartCmsContentConfig?: { csrfToken?: string } }).SmartCmsContentConfig?.csrfToken ?? ''
        )
      );

  requestGenerate = (
    endpointPath: string,
    options: { method?: string; body?: Record<string, unknown> } = {}
  ): Cypress.Chainable<Cypress.Response<{ error?: unknown }>> =>
    cy.request({
      method: options.method ?? 'POST',
      url: `${Cypress.env('backofficeUrl')}${endpointPath}`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: options.body,
      failOnStatusCode: false,
    });
}
