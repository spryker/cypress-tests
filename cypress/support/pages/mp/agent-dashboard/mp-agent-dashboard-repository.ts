import { injectable } from 'inversify';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class MpAgentDashboardRepository {
  getDashboardSidebarSelector = (): Cypress.Chainable => cy.get('spy-sidebar.spy-sidebar');

  getFirstTableRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };

  getSearchSelector = (): string => {
    return '.spy-table-search-feature input[type="text"]';
  };

  getAssistUserButtonSelector = (): string => {
    return 'button:contains("Assist User")';
  };

  getModalConfirmButton = (): Cypress.Chainable => {
    return cy.get('.ant-modal-confirm-col').find('button:contains("Confirm")');
  };
}
