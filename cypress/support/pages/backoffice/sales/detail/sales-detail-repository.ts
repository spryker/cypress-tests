import { injectable } from 'inversify';
import 'reflect-metadata';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class SalesDetailRepository {
  getTriggerOmsDivSelector = (): string => '.col-md-12 > .row > .col-lg-12 > .ibox > .ibox-content';
  getOmsButtonSelector = (action: string): string => `button:contains("${action}")`;
  getReturnButton = (): Cypress.Chainable => cy.get('.title-action').find('a:contains("Return")');
}
