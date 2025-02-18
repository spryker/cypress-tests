import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAddRepository } from './ssp-file-management-add-repository';

@injectable()
@autoWired
export class SspFileManagementAddPage extends BackofficePage {
  @inject(SspFileManagementAddRepository) private repository: SspFileManagementAddRepository;

  protected PAGE_URL = '/ssp-file-management/add-files/index';

  loadTestFiles(): Cypress.Chainable<
    Array<{ fileContent: any; fileName: string; mimeType: string; filePath: string }>
  > {
    const testFiles: Array<{ fileContent: any; fileName: string; mimeType: string; filePath: string }> = [];

    return cy
      .fixture('suite/backoffice/ssp-file-management/test-files/document1.pdf', 'binary')
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'document1.pdf',
          mimeType: 'application/pdf',
          filePath: 'cypress/fixtures/suite/backoffice/ssp-file-management/test-files/document1.pdf',
        });
      })
      .then(() => {
        return cy.fixture('suite/backoffice/ssp-file-management/test-files/image1.jpeg', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'image1.jpeg',
          mimeType: 'image/jpeg',
          filePath: 'cypress/fixtures/suite/backoffice/ssp-file-management/test-files/image1.jpeg',
        });
      })
      .then(() => {
        return cy.fixture('suite/backoffice/ssp-file-management/test-files/image2.png', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'image2.png',
          mimeType: 'image/png',
          filePath: 'cypress/fixtures/suite/backoffice/ssp-file-management/test-files/image2.png',
        });
      })
      .then(() => {
        return cy.fixture('suite/backoffice/ssp-file-management/test-files/document2.pdf', 'binary');
      })
      .then((fileContent) => {
        testFiles.push({
          fileContent,
          fileName: 'document2.pdf',
          mimeType: 'application/pdf',
          filePath: 'cypress/fixtures/suite/backoffice/ssp-file-management/test-files/document2.pdf',
        });
      })
      .then(() => testFiles);
  }

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
    cy.get(this.repository.getFileInputSelector()).should('have.attr', 'accept', '.pdf,.jpeg,.jpg,.png,.heic,.heif');
    cy.get(this.repository.getFileInputSelector()).should('have.attr', 'size', '100M');
    cy.get(this.repository.getFileInputSelector()).should('have.attr', 'max', '4');
  }

  submitForm(): void {
    cy.get(this.repository.getSubmitButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector()).should('be.visible');
  }
}
