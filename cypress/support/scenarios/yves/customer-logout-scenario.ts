import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLogoutScenario {
  execute = (): void => {
    cy.get('[data-qa="customer-logout-link"]').first().click({ force: true });
  };
}
