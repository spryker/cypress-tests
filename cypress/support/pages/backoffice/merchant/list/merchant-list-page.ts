import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { MerchantListRepository } from './merchant-list-repository';

@injectable()
@autoWired
export class MerchantListPage extends BackofficePage {
  @inject(MerchantListRepository) private repository: MerchantListRepository;

  protected PAGE_URL = '/merchant-gui/list-merchant';

  editMerchant = (query: string): void => {
    this.findMerchant(query).find(this.repository.getEditButtonSelector()).click();
  };

  activateMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getActivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  deactivateMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeactivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  approveAccessMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getApproveAccessButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  denyAccessMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDenyAccessButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  findMerchant = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-gui/list-merchant/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };
}
