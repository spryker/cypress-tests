import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLogoutScenario {
  execute = (): void => {
    cy.visit('/agent/logout');
  };
}
