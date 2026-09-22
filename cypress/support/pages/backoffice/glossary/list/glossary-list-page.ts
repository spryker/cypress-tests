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
      expectedCount: 1,
    }).then((getRow) => (getRow ? getRow() : null));
  };

  edit = (glossaryKey: string): void => {
    // expectedCount settles the row count too: the key assertion alone passes on the filtered
    // render, which a late unfiltered response can replace before the click picks a row.
    this.find({
      searchQuery: glossaryKey,
      interceptTableUrl: this.TABLE_URL,
      expectedToSeeInTable: glossaryKey,
      expectedCount: 1,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().find(this.repository.getEditButtonSelector()).click({ force: true });
    });
  };
}
