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

  assertDetachFile(): void {
    this.repository.getAttachmentTableRows().should('have.length.greaterThan', 1);
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'File attachment successfully unlinked.');
  }
}
