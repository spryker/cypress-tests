import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementDetachRepository } from './ssp-file-management-detach-repository';

@injectable()
@autoWired
export class SspFileManagementDetachPage extends BackofficePage {
  @inject(SspFileManagementDetachRepository) private repository: SspFileManagementDetachRepository;

  detachFile(): void {
    cy.get(this.repository.getDetachButtonSelector()).first().click();
  }

  getAttachmentTableRows = (): Cypress.Chainable => this.repository.getAttachmentTableRows();

  getSuccessMessage = (): Cypress.Chainable => cy.get(this.repository.getSuccessMessageSelector());
}
