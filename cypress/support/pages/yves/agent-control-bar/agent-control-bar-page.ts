import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { AgentControlBarRepository } from './agent-control-bar-repository';

@injectable()
@autoWired
export class AgentControlBarPage extends YvesPage {
  @inject(AgentControlBarRepository) private repository: AgentControlBarRepository;

  protected PAGE_URL = '/';

  impersonate = (email: string): void => {
    const alias = 'customerAutocomplete';

    cy.intercept('GET', this.repository.getCustomerAutocompleteUrl()).as(alias);
    this.repository.getCustomerSearchInput().clear();
    this.repository.getCustomerSearchInput().type(email);

    // The suggestion list is rendered from this response, so waiting on it removes the race
    // between typing and the list appearing.
    cy.wait(`@${alias}`);

    this.repository.getSuggestion(email).click();
    this.repository.getConfirmButton().click();
  };

  endAssistance = (): void => {
    this.repository.getEndAssistanceLink().click();
  };

  getEndAssistanceLink = (): Cypress.Chainable => this.repository.getEndAssistanceLink();
}
