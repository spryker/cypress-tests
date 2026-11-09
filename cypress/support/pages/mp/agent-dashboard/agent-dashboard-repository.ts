import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentDashboardRepository {
  getDashboardSidebarSelector = (): Cypress.Chainable => cy.get('spy-sidebar.spy-sidebar');
  getTableRowContaining = (text: string): Cypress.Chainable =>
    cy.contains('nz-table-inner-default tbody > tr:visible', text);
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getAssistUserButtonSelector = (): string => 'button:contains("Assist User")';
  getEndUserAssistanceSelector = (): string => 'a:contains("End User Assistance")';
  getLogoutAgentSelector = (): string => 'a:contains("Log out Agent")';
  getModalConfirmButton = (): Cypress.Chainable =>
    cy.get('.ant-modal--confirmation').find('button:contains("Confirm")');
  getUserMenu = (): Cypress.Chainable => cy.get('.spy-user-menu');
}
