import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryEditRepository, CategoryFlag } from './category-edit-repository';

@injectable()
@autoWired
export class CategoryEditPage extends BackofficePage {
  @inject(REPOSITORIES.CategoryEditRepository) private repository: CategoryEditRepository;

  protected PAGE_URL = '/category-gui/edit';

  visitEditPage = (idCategory: number): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id-category=${idCategory}`);
  };

  getHeading = (): Cypress.Chainable => this.repository.getHeading();

  getHeadingText = (): string => this.repository.getHeadingText();

  getKeyInput = (): Cypress.Chainable => this.repository.getKeyInput();

  getFlagCheckbox = (flag: CategoryFlag): Cypress.Chainable => this.repository.getFlagCheckbox(flag);

  toggleFlag = (flag: CategoryFlag): void => {
    this.repository.getFlagCheckbox(flag).click({ force: true });
  };

  submit = (): void => {
    this.repository.getSubmitButton().click();
  };

  getUpdateSuccessMessage = (): Cypress.Chainable => cy.contains(this.repository.getUpdateSuccessMessage());
}
