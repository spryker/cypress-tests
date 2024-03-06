import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentDashboardRepository {
  getDashboardSidebarSelector = (): Cypress.Chainable => cy.get('spy-sidebar.spy-sidebar');
  getFirstTableRow = (): Cypress.Chainable => cy.get('nz-table-inner-default tbody > :nth-child(1)');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getAssistUserButtonSelector = (): string => 'button:contains("Assist User")';
  getModalConfirmButton = (): Cypress.Chainable =>
    cy.get('[ng-reflect-ng-class="ant-modal--confirmation"]').find('button:contains("Confirm")');
}
