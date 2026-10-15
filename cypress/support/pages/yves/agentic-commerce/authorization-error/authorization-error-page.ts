import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { YvesPage } from '../../yves-page';

@injectable()
@autoWired
export class AuthorizationErrorPage extends YvesPage {
  protected PAGE_URL = '/connect/authorize';

  getErrorBox = (): Cypress.Chainable => cy.get('[data-qa="agentic-commerce-authorization-error"]');
}
