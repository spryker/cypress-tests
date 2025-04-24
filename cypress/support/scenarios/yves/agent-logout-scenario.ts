import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLogoutScenario {
  execute = (): void => {
    cy.contains('li a', 'Logout').click({ force: true });
  };
}
