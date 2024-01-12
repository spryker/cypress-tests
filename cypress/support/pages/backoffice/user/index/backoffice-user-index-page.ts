import { AbstractPage } from '../../../abstract-page';
import { BackofficeUserIndexRepository } from './backoffice-user-index-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeUserIndexPage extends AbstractPage {
  public PAGE_URL: string = '/user';

  constructor(
    @inject(BackofficeUserIndexRepository)
    private repository: BackofficeUserIndexRepository
  ) {
    super();
  }

  createNewUser = (): void => {
    this.repository.getCreateNewUserButton().click();
  };

  editUser = (email: string): void => {
    this.findUser(email).find(this.repository.getEditButtonSelector()).click();
  };

  findUser = (email: string): Cypress.Chainable => {
    cy.get(this.repository.getUserSearchSelector()).clear().type(email);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/user/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstUserRow();
  };

  ensureUserTableHasAgentMerchantColumn = (): void => {
    this.repository.getUserTableHeader().contains('Agent Merchant');
  };

  ensureUserTableHasAgentCustomerColumn = (): void => {
    this.repository.getUserTableHeader().contains('Agent Customer');
  };
}
