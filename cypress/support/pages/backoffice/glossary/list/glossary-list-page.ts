import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { GlossaryListRepository } from './glossary-list-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class GlossaryListPage extends BackofficePage {
  @inject(GlossaryListRepository) private repository: GlossaryListRepository;

  protected PAGE_URL = '/glossary';
  private readonly TABLE_URL = '**/glossary/index/table**';

  clickCreateTranslation = (): void => {
    this.repository.getCreateTranslationButton().click();
  };

  findTranslation = (glossaryKey: string): Chainable => {
    return this.find({
      searchQuery: glossaryKey,
      interceptTableUrl: this.TABLE_URL,
      expectedToSeeInTable: glossaryKey,
    }).then((getRow) => (getRow ? getRow() : null));
  };

  edit = (glossaryKey: string): void => {
    // Without asserting the key is in the table first, a search that has not narrowed yet leaves
    // the previous first row in place and the wrong translation gets edited.
    this.find({
      searchQuery: glossaryKey,
      interceptTableUrl: this.TABLE_URL,
      expectedToSeeInTable: glossaryKey,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().find(this.repository.getEditButtonSelector()).click({ force: true });
    });
  };
}
