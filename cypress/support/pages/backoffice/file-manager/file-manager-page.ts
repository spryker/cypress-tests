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

  getBlankValueError = (): string => this.repository.getBlankValueError();

  getMaxLengthError = (): string => this.repository.getMaxLengthError();

  getSuccessMessage = (): Cypress.Chainable => cy.contains(this.repository.getSuccessMessage());

  getSqlQueryError = (): Cypress.Chainable => cy.contains(this.repository.getSqlQueryError());

  getDirectoryNameErrorBlock = (): Cypress.Chainable => this.repository.getDirectoryNameErrorBlock();

  getLocalizedTitleErrorBlockById = (id: string): Cypress.Chainable =>
    this.repository.getLocalizedTitleErrorBlockById(id);

  // The locale iboxes render one localized-title input each and their ids are only known at runtime,
  // so the caller resolves the ids first and then asserts on every matching help-block. Mirrors the
  // Codeception loop over getLocalizedTitleFieldIds().
  getLocalizedTitleInputIds = (): Cypress.Chainable<Array<string>> =>
    this.repository
      .getLocalizedTitleInputs()
      .then(($inputs) => Cypress._.map($inputs.toArray(), 'id')) as unknown as Cypress.Chainable<Array<string>>;

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
    this.getLocalizedTitleInputIds().then((ids) => ids.forEach((id) => callback(id)));
  }
}
