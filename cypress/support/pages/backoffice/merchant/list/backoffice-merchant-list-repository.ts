import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeMerchantListRepository {
  getFirstTableRow = (): Cypress.Chainable => {
    return cy.get('tbody > :nth-child(1)');
  };

  getSearchSelector = (): string => {
    return '[type="search"]';
  };

  getEditButtonSelector = (): string => {
    return 'a:contains("Edit")';
  };

  getActivateButtonSelector = (): string => {
    return 'button:contains("Activate")';
  };

  getDeactivateButtonSelector = (): string => {
    return 'button:contains("Deactivate")';
  };

  getApproveAccessButtonSelector = (): string => {
    return 'button:contains("Approve Access")';
  };

  getDenyAccessButtonSelector = (): string => {
    return 'button:contains("Deny Access")';
  };
}
