import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementDeleteRepository } from './ssp-file-management-delete-repository';

@injectable()
@autoWired
export class SspFileManagementDeletePage extends BackofficePage {
  @inject(SspFileManagementDeleteRepository) private repository: SspFileManagementDeleteRepository;

  confirmDelete(): void {
    cy.get(this.repository.getDeleteConfirmButtonSelector()).click();
  }

  getSuccessMessage = (): Cypress.Chainable => cy.get(this.repository.getSuccessMessageSelector());

  getFileTableRows = (): Cypress.Chainable => this.repository.getFileTableRows();

  getEmptyRowSelector = (): string => this.repository.getEmptyRowSelector();
}
