import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeMerchantListRepository } from './backoffice-merchant-list-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class BackofficeMerchantListPage extends BackofficePage {
  protected PAGE_URL: string = '/merchant-gui/list-merchant';

  constructor(@inject(BackofficeMerchantListRepository) private repository: BackofficeMerchantListRepository) {
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
    cy.get(this.repository.getSearchSelector()).clear().type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-gui/list-merchant/table**').as(interceptAlias);
    cy.wait(`@${interceptAlias}`).its('response.body.recordsFiltered').should('eq', 1);

    return this.repository.getFirstTableRow();
  };
}
