import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../../backoffice-page';
import { ScopeCeilingRepository } from './scope-ceiling-repository';

@injectable()
@autoWired
export class ScopeCeilingPage extends BackofficePage {
  @inject(ScopeCeilingRepository) private repository: ScopeCeilingRepository;

  protected PAGE_URL = '/agentic-commerce/agentic-commerce-client/edit-scope-ceiling';

  visitForClient = (clientId: string, options?: Partial<Cypress.VisitOptions>): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?client-identifier=${clientId}`, options);
  };

  getScopeCheckboxes = (): Cypress.Chainable => this.repository.getScopeCheckboxes();

  getScopeCheckbox = (scope: string): Cypress.Chainable => this.repository.getScopeCheckbox(scope);

  setScope = (scope: string, isAllowed: boolean): void => {
    if (isAllowed) {
      this.repository.getScopeCheckbox(scope).check({ force: true });

      return;
    }

    this.repository.getScopeCheckbox(scope).uncheck({ force: true });
  };

  save = (): void => {
    this.repository.getSubmitButton().click();
  };
}
