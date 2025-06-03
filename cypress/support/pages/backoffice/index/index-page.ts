import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class IndexPage extends BackofficePage {
  protected PAGE_URL = '/';

  assertLoginFormDoesNotExist = (): void => {
    cy.get('form[name="auth"]').should('not.exist');
  }
}
