import { injectable } from 'inversify';
import { autoWired } from '@utils';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class FileManagerAttachmentDetachRepository {
  getDetachButtonSelector = (): string => '[data-qa="unlink-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
  getAttachmentTableRows = (): Chainable => cy.get('table.gui-table-data tbody tr');
}
