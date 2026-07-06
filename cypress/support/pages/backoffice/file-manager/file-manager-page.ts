import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { FileManagerRepository } from './file-manager-repository';

@injectable()
@autoWired
export class FileManagerPage extends BackofficePage {
  @inject(REPOSITORIES.FileManagerRepository) private repository: FileManagerRepository;

  protected PAGE_URL = '/file-manager-gui/add-directory';

  createDirectory = (directoryName: string, localizedTitle = ''): void => {
    this.visit();

    this.repository.getDirectoryNameInput().should('be.visible');

    if (directoryName) {
      this.repository.getDirectoryNameInput().clear().type(directoryName);
    }

    this.fillLocalizedTitles(localizedTitle);

    this.repository.getSubmitButton().click();
  };

  assertBlankValueErrors = (): void => {
    this.assertDirectoryNameError(this.repository.getBlankValueError());
    this.assertLocalizedTitleErrors(this.repository.getBlankValueError());
    this.assertNoSqlQueryError();
  };

  assertMaxLengthErrors = (): void => {
    this.assertDirectoryNameError(this.repository.getMaxLengthError());
    this.assertLocalizedTitleErrors(this.repository.getMaxLengthError());
    this.assertNoSqlQueryError();
  };

  assertSuccessMessage = (): void => {
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
    this.assertNoSqlQueryError();
  };

  private assertDirectoryNameError(message: string): void {
    this.repository.getDirectoryNameErrorBlock().should('contain.text', message);
  }

  // Mirrors the Codeception loop over getLocalizedTitleFieldIds(): every localized
  // title collected from the (initially collapsed) locale iboxes must surface the
  // same validation message in its adjacent help-block.
  private assertLocalizedTitleErrors(message: string): void {
    this.eachLocalizedTitleId((id) => {
      this.repository.getLocalizedTitleErrorBlockById(id).should('contain.text', message);
    });
  }

  private assertNoSqlQueryError(): void {
    cy.contains(this.repository.getSqlQueryError()).should('not.exist');
  }

  private fillLocalizedTitles(localizedTitle: string): void {
    this.eachLocalizedTitleId((id) => {
      // Reveal the collapsed locale ibox before interacting with its title input,
      // replicating the Codeception click on the localized-attributes parent.
      this.repository.getLocalizedTitleIboxTitleByInputId(id).click();

      if (localizedTitle) {
        this.repository.getLocalizedTitleInputById(id).clear().type(localizedTitle);
      }
    });
  }

  private eachLocalizedTitleId(callback: (id: string) => void): void {
    this.repository.getLocalizedTitleInputs().then(($inputs) => {
      const ids: Array<string> = Cypress._.map($inputs.toArray(), 'id');

      ids.forEach((id) => callback(id));
    });
  }
}
