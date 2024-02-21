import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeMerchantUpdateRepository } from './backoffice-merchant-update-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeMerchantUpdatePage extends AbstractPage {
  public PAGE_URL: string = '/merchant-gui/edit-merchant';

  constructor(@inject(BackofficeMerchantUpdateRepository) private repository: BackofficeMerchantUpdateRepository) {
    super();
  }

  public findUser = (email: string): Cypress.Chainable => {
    cy.get(this.repository.getSearchSelector()).clear().type(email);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-user-gui/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  public createNewUser = (): void => {
    this.repository.getUsersTab().click();
    this.repository.getAddMerchantUserButton().click();
  };
}
