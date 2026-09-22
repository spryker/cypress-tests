import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AclDeniedRepository {
  getAccessDeniedTitle = (): Cypress.Chainable => cy.get('[data-qa="access-denied-title"]');
}
