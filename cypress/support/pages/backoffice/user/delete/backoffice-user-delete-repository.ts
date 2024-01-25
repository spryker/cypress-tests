import { injectable } from 'inversify';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import 'reflect-metadata';

@injectable()
@autoProvide
export class BackofficeUserDeleteRepository {
  getDeleteButton = (): Cypress.Chainable => {
    return cy.get('form[name=delete_confirm_form]').find('[type="submit"]');
  };
}
