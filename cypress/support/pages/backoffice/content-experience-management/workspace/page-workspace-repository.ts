import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class PageWorkspaceRepository {
  getHeader = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-header"]');

  getStatus = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-header"] [data-qa="content-status"]');

  getPanel = (panel: PageWorkspacePanel): Cypress.Chainable => cy.get(`[data-qa="page-workspace-panel-${panel}"]`);

  getToggleActiveButton = (): Cypress.Chainable => cy.get('[data-qa="page-workspace-toggle-active"]');

  getDeactivatedMessage = (): string => 'Page deactivated.';
}

export type PageWorkspacePanel = 'content' | 'settings' | 'placements' | 'menus' | 'history';
