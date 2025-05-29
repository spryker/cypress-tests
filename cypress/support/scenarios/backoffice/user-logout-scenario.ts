import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class UserLogoutScenario {
  execute = (): void => {
    cy.contains('a', 'Log out').click({ force: true });
  };
}
