import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SalesDetailRepository {
  getTriggerOmsDivSelector = (): string => '.col-md-12 > .row > .col-lg-12 > .ibox > .ibox-content';
  getOmsButtonSelector = (action: string): string => `button:contains("${action}")`;
  getReturnButton = (): Cypress.Chainable => cy.get('.title-action').find('a:contains("Return")');
}
