import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeMerchantListRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1)');
  getSearchSelector = (): string => '[type="search"]';
  getEditButtonSelector = (): string => 'a:contains("Edit")';
  getActivateButtonSelector = (): string => 'button:contains("Activate")';
  getDeactivateButtonSelector = (): string => 'button:contains("Deactivate")';
  getApproveAccessButtonSelector = (): string => 'button:contains("Approve Access")';
  getDenyAccessButtonSelector = (): string => 'button:contains("Deny Access")';
}
