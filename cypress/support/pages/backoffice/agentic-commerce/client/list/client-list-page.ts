import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../../backoffice-page';
import { ClientListRepository } from './client-list-repository';

@injectable()
@autoWired
export class ClientListPage extends BackofficePage {
  @inject(ClientListRepository) private repository: ClientListRepository;

  protected PAGE_URL = '/agentic-commerce/agentic-commerce-client';

  findClient = (clientId: string): Cypress.Chainable => {
    this.waitForFirstTableLoad();

    return this.find({
      interceptTableUrl: '**/agentic-commerce/agentic-commerce-client/table**',
      searchQuery: clientId,
      expectedToSeeInTable: clientId,
    });
  };

  getRegisterClientButton = (): Cypress.Chainable => this.repository.getRegisterClientButton();

  getBlockButtonSelector = (): string => this.repository.getBlockButtonSelector();

  getUnblockButtonSelector = (): string => this.repository.getUnblockButtonSelector();

  block = (clientId: string): void => {
    this.clickRowAction(clientId, this.repository.getBlockButtonSelector());
    this.repository.getConfirmButton().click();
  };

  unblock = (clientId: string): void => {
    this.clickRowAction(clientId, this.repository.getUnblockButtonSelector());
    this.repository.getConfirmButton().click();
  };

  getFlashMessage = (): Cypress.Chainable => this.repository.getFlashMessage();

  private clickRowAction = (clientId: string, actionSelector: string): void => {
    this.findClient(clientId).then((getRow) => {
      if (getRow) {
        getRow().find(actionSelector).click();
      }
    });
  };

  // The table search gets its data-qa only after the first load, which takes about 5 s on a dev stack.
  private waitForFirstTableLoad = (): void => {
    cy.get('input[type="search"][data-qa="table-search"]', { timeout: 30000 });
  };
}
