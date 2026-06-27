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
  enableSmartCms = (): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (!($toggle[0] as HTMLInputElement).checked) {
        cy.wrap($toggle).check({ force: true });

        cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
        cy.get(this.repository.getSaveButtonSelector()).click();
        cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
      }
    });

    return cy.get(this.repository.getEnableToggleSelector()).should('be.checked');
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

  getPanelToggle = (): Cypress.Chainable => cy.get(this.repository.getPanelToggleSelector());

  getPanelInput = (): Cypress.Chainable => cy.get(this.repository.getPanelInputSelector());

  getPanelAsk = (): Cypress.Chainable => cy.get(this.repository.getPanelAskSelector());

  getPanelAttach = (): Cypress.Chainable => cy.get(this.repository.getPanelAttachSelector());
}
