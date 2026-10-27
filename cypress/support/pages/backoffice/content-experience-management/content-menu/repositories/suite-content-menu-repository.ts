import { injectable } from 'inversify';
import { ContentMenuRepository } from '../content-menu-repository';

@injectable()
export class SuiteContentMenuRepository implements ContentMenuRepository {
  getContentMenuHomeLink = (): Cypress.Chainable =>
    cy.get('[data-qa="menu-item-link"][href="/content-experience-management/home"]');

  getContentMenuEntrySelector = (): string => '[data-qa="menu-item-link"]';

  getContentMenuSubmenuSelector = (): string => '[data-qa="menu-submenu"]';

  getMenuLinkByUrl = (url: string): Cypress.Chainable => cy.get(`[data-qa="menu-item-link"][href="${url}"]`);

  getDataTable = (): Cypress.Chainable => cy.get('[data-qa="data-table"]');
}
