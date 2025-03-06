import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLogoutScenario {
  execute = (): void => {
    cy.contains('li a', 'Logout').click({ force: true });
  };
}
