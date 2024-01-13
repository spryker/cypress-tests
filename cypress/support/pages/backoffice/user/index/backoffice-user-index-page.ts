import { AbstractPage } from '../../../abstract-page';
import { BackofficeUserIndexRepository } from './backoffice-user-index-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class BackofficeUserIndexPage extends AbstractPage {
  public PAGE_URL: string = '/user';

  constructor(@inject(BackofficeUserIndexRepository) private repository: BackofficeUserIndexRepository) {
    super();
  }

  public createNewUser = (): void => {
    this.repository.getCreateNewUserButton().click();
  };

  public editUser = (email: string): void => {
    this.findUser(email).find(this.repository.getEditButtonSelector()).click();
  };

  public findUser = (email: string): Cypress.Chainable => {
    cy.get(this.repository.getUserSearchSelector()).clear().type(email);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/user/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstUserRow();
  };

  public getUserTableHeader = (): Cypress.Chainable => {
    return this.repository.getUserTableHeader();
  };
}
