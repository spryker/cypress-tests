import { injectable } from 'inversify';
import { autoWired } from '@utils';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class FileManagerAttachmentDeleteRepository {
  getDeleteConfirmButtonSelector = (): string => '[data-qa="delete-confirm-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
  getFileTableRows = (): Chainable => cy.get('table.gui-table-data tbody tr');
}
