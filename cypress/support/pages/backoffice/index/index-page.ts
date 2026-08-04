import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class IndexPage extends BackofficePage {
  protected PAGE_URL = '/';

  getLoginForm = (): Cypress.Chainable => cy.get('form[name="auth"]');
}
