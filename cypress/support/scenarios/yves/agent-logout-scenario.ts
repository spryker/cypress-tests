import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AgentLogoutScenario {
  execute = (): void => {
    cy.visit('/agent/logout');
    // The logout response rotates the session id. Clear cookies so both the browser
    // and the Cypress top-level navigation cookie jars start from a clean state,
    // otherwise later full-page loads replay the stale pre-logout session cookie.
    cy.clearCookies();
  };
}
