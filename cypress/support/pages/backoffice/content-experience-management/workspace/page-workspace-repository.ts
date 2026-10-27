import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PageWorkspaceRepository {
  getHeader = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-header"]');

  getStatus = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-header"] [data-qa="content-status"]');

  getPanel = (panel: PageWorkspacePanel): Cypress.Chainable => cy.get(`[data-qa="page-workspace-panel-${panel}"]`);

  getOpenBuilderButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-open-builder"]');

  getPublishButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-publish"]');

  getPublishModal = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-publish-modal"]');

  getPublishConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-publish-confirm"]');

  getPublishCancelButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-publish-cancel"]');

  getToggleActiveButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-toggle-active"]');

  getDeactivateModal = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-deactivate-modal"]');

  getDeactivateConfirmButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-deactivate-confirm"]');

  getDeactivatedMessage = (): string => 'Page deactivated.';

  getActivatedMessage = (): string => 'Page activated.';
}

export type PageWorkspacePanel = 'content' | 'settings' | 'placements' | 'menus' | 'history';
