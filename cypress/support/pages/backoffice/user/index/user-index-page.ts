import { AbstractPage } from '../../../abstract-page';
import { UserIndexRepository } from './user-index-repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class UserIndexPage extends AbstractPage {
  PAGE_URL: string = '/user';
  repository: UserIndexRepository;

  constructor(@inject(UserIndexRepository) repository: UserIndexRepository) {
    super();
    this.repository = repository;
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
    cy.wait(`@${interceptAlias}`)
      .its('response.body.recordsFiltered')
      .should('eq', 1);

    return this.repository.getFirstUserRow();
  };
}
