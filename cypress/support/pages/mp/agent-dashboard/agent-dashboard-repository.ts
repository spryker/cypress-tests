import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class AgentDashboardRepository {
  getDashboardSidebarSelector = (): Cypress.Chainable => cy.get('spy-sidebar.spy-sidebar');
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1)');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getAssistUserButtonSelector = (): string => 'button:contains("Assist User")';
  getModalConfirmButton = (): Cypress.Chainable => cy.get('.ant-modal-confirm-col').find('button:contains("Confirm")');
}
