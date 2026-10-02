import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ContentHubRepository {
  getTab = (tab: ContentHubTab): Cypress.Chainable => cy.get(`[data-qa="content-hub-tab-${tab}"]`);

  getSearchInput = (): Cypress.Chainable => cy.get('[data-qa="content-hub-search"] input[name="q"]');

  getSearchButton = (): Cypress.Chainable => cy.get('[data-qa="content-hub-search"] button[type="submit"]');

  // The hub tables hydrate via AJAX; the row is matched by its text once DataTables has rendered it.
  getTableRow = (text: string): Cypress.Chainable => cy.contains('table.dataTable tbody tr', text, { timeout: 20000 });

  getWorkspaceLinkSelector = (): string => 'a[href*="/content-experience-management/page-workspace"]';

  getUsageLinkSelector = (): string => 'a[href*="/content-experience-management/usage"]';
}

export type ContentHubTab = 'page-list' | 'block-list' | 'content-item-list';
