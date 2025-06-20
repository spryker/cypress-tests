import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantUserLogoutScenario {
  execute = (): void => {
    cy.contains('a', 'Logout').click({ force: true });
  };
}
