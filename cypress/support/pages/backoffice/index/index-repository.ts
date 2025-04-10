import { autoWired } from '@utils';
import Chainable = Cypress.Chainable;
import { injectable } from 'inversify';
@injectable()
@autoWired
export class IndexRepository {
  public getStylesheetLinkWithHash(): Chainable {
    return cy.get('head link[rel="stylesheet"][href*="v="]');
  }
  public getScriptImportWithHash(): Chainable {
    return cy.get('script[src*="v="]');
  }
}
