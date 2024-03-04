import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MerchantListRepository } from './merchant-list-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class MerchantListPage extends BackofficePage {
  protected PAGE_URL: string = '/merchant-gui/list-merchant';

  constructor(@inject(MerchantListRepository) private repository: MerchantListRepository) {
    super();
  }

  public editMerchant = (query: string): void => {
    this.findMerchant(query).find(this.repository.getEditButtonSelector()).click();
  };

  public activateMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getActivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public deactivateMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDeactivateButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public approveAccessMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getApproveAccessButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public denyAccessMerchant = (query: string): void => {
    this.findMerchant(query).then((merchantRow) => {
      const button = merchantRow.find(this.repository.getDenyAccessButtonSelector());

      if (button.length) {
        button.click();
      }
    });
  };

  public findMerchant = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-gui/list-merchant/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };
}
