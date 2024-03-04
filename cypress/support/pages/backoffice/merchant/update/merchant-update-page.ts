import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MerchantUpdateRepository } from './merchant-update-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class MerchantUpdatePage extends BackofficePage {
  protected PAGE_URL: string = '/merchant-gui/edit-merchant';

  constructor(@inject(MerchantUpdateRepository) private repository: MerchantUpdateRepository) {
    super();
  }

  public findUser = (email: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(email);

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
