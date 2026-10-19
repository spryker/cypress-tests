import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../../backoffice-page';
import { ConsentListRepository } from './consent-list-repository';

@injectable()
@autoWired
export class ConsentListPage extends BackofficePage {
  @inject(ConsentListRepository) private repository: ConsentListRepository;

  protected PAGE_URL = '/agentic-commerce/agentic-commerce-consent';

  findConsent = (clientId: string): Cypress.Chainable => {
    this.waitForFirstTableLoad();

    return this.find({
      interceptTableUrl: '**/agentic-commerce/agentic-commerce-consent/table**',
      searchQuery: clientId,
      expectedToSeeInTable: clientId,
    });
  };

  getRevokeButtonSelector = (): string => this.repository.getRevokeButtonSelector();

  getFlashMessage = (): Cypress.Chainable => this.repository.getFlashMessage();

  revoke = (clientId: string): void => {
    this.findConsent(clientId).then((getRow) => {
      if (getRow) {
        getRow().find(this.repository.getRevokeButtonSelector()).click();
      }
    });
    this.repository.getConfirmButton().click();
  };

  // The table search gets its data-qa only after the first load, which takes about 5 s on a dev stack.
  private waitForFirstTableLoad = (): void => {
    cy.get('input[type="search"][data-qa="table-search"]', { timeout: 30000 });
  };
}
