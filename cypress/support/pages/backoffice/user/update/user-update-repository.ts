import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class UserUpdateRepository {
  getAgentMerchantCheckbox = (): Cypress.Chainable => {
    return cy.get('#user_is_merchant_agent');
  };
  getAgentCustomerCheckbox = (): Cypress.Chainable => {
    return cy.get('#user_is_agent');
  };
  getUpdateUserButton = (): Cypress.Chainable => {
    return cy.get('form[name=user]').find('[type="submit"]');
  };
}
