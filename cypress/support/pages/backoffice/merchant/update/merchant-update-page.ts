import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { MerchantUpdateRepository } from './merchant-update-repository';

@injectable()
@autoWired
export class MerchantUpdatePage extends BackofficePage {
  @inject(MerchantUpdateRepository) private repository: MerchantUpdateRepository;

  protected PAGE_URL: string = '/merchant-gui/edit-merchant';

  findUser = (email: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(email);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-user-gui/index/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  createNewUser = (): void => {
    this.repository.getUsersTab().click();
    this.repository.getAddMerchantUserButton().click();
  };
}
