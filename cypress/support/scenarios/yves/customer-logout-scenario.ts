import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerLogoutScenario {
  execute = (): void => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-qa="customer-logout-link"]').length > 0) {
        cy.get('[data-qa="customer-logout-link"]').first().click({ force: true });
      } else {
        cy.contains('li a', 'Logout').click({ force: true });
      }
    });
  };
}
