import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ScopeCeilingRepository {
  getForm = (): Cypress.Chainable => cy.get('form[name="scope_ceiling"]');
  getScopeCheckboxes = (): Cypress.Chainable => cy.get('input[name="scope_ceiling[scope_ceiling][]"]');
  getScopeCheckbox = (scope: string): Cypress.Chainable =>
    cy.get(`input[name="scope_ceiling[scope_ceiling][]"][value="${scope}"]`);
  getSubmitButton = (): Cypress.Chainable => cy.get('form[name="scope_ceiling"] input[type="submit"]');
}
