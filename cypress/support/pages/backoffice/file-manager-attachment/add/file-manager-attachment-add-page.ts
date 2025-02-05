import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentAddRepository } from './file-manager-attachment-add-repository';

@injectable()
@autoWired
export class FileManagerAttachmentAddPage extends BackofficePage {
  @inject(FileManagerAttachmentAddRepository) private repository: FileManagerAttachmentAddRepository;

  protected PAGE_URL = '/ssp-file-management/add-files/index';

  uploadFiles(files: Array<{ fileContent: any; fileName: string; mimeType: string; filePath: string }>): void {
    cy.get(this.repository.getFileInputSelector()).selectFile(
      files.map((file) => ({
        contents: file.filePath,
        fileName: file.fileName,
        mimeType: file.mimeType,
      })),
      {
        force: true,
      }
    );
  }

  verifyFileUploadConstraints(): void {
    cy.get(this.repository.getFileInputSelector()).should('have.attr', 'multiple');
  }

  submitForm(): void {
    cy.get(this.repository.getSubmitButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector()).should('be.visible');
  }
}
