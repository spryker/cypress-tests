import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { AgentControlBarRepository } from './agent-control-bar-repository';

@injectable()
@autoWired
export class AgentControlBarPage extends YvesPage {
  @inject(REPOSITORIES.AgentControlBarRepository) private repository: AgentControlBarRepository;

  protected PAGE_URL = '/';

  /**
   * Forced, because some agent controls keep their search in a popover that only opens on hover,
   * which Cypress cannot produce. Waits until the storefront shows the assistance as running.
   */
  impersonate = (email: string): void => {
    const alias = 'customerAutocomplete';

    cy.intercept('GET', this.repository.getCustomerAutocompleteUrl()).as(alias);
    this.repository.getCustomerSearchInput().clear({ force: true });
    this.repository.getCustomerSearchInput().type(email, { force: true });

    // The suggestion list is rendered from this response, so waiting on it removes the race
    // between typing and the list appearing.
    cy.wait(`@${alias}`);

    this.repository.getSuggestion(email).click({ force: true });
    this.confirmSelection();
    this.repository.getActiveAssistanceIndicator();
  };

  endAssistance = (): void => {
    this.repository.getEndAssistanceLink().click();
  };

  getActiveAssistanceIndicator = (): Cypress.Chainable => this.repository.getActiveAssistanceIndicator();

  getEndAssistanceLink = (): Cypress.Chainable => this.repository.getEndAssistanceLink();

  getCustomerSearchInput = (): Cypress.Chainable => this.repository.getCustomerSearchInput();

  /**
   * The b2b-mp agent control submits the switch as soon as a suggestion is picked. The b2b id runs on
   * that theme and on the classic bar, which asks for a confirmation, so there the button is looked for.
   */
  private confirmSelection = (): void => {
    const confirmButtonSelector = this.repository.getConfirmButtonSelector();

    if (this.isRepository('b2b-mp')) {
      return;
    }

    if (this.isRepository('b2b')) {
      cy.get('body').then(($body) => {
        if ($body.find(confirmButtonSelector).length) {
          cy.get(confirmButtonSelector).click();
        }
      });

      return;
    }

    cy.get(confirmButtonSelector).click();
  };
}
