import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { GlossaryFormRepository } from './glossary-form-repository';

@injectable()
@autoWired
export class GlossaryFormPage extends BackofficePage {
  @inject(GlossaryFormRepository) private repository: GlossaryFormRepository;

  protected PAGE_URL = '/glossary/add';

  create = (params: CreateParams): void => {
    this.repository.getGlossaryKeyInput().clear().type(params.glossaryKey);
    this.fillEveryLocale(params.translation);
    this.save();
  };

  // The edit form renders the same locale fields; only the key is fixed.
  update = (translation: string): void => {
    this.fillEveryLocale(translation);
    this.save();
  };

  getLocaleTextareas = (): Cypress.Chainable => this.repository.getLocaleTextareas();

  private fillEveryLocale = (translation: string): void => {
    // Every locale is filled because the collection is NotBlank and which locales exist
    // depends on the store the repository is running against.
    this.repository.getLocaleTextareas().each(($textarea) => {
      cy.wrap($textarea).clear();
      cy.wrap($textarea).type(translation);
    });
  };

  private save = (): void => {
    this.repository.getSaveButton().click();
  };
}

interface CreateParams {
  glossaryKey: string;
  translation: string;
}
