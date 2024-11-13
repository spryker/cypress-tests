import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { BlockListRepository } from './block-list-repository';

@injectable()
@autoWired
export class BlockListPage extends BackofficePage {
  @inject(BlockListRepository) private repository: BlockListRepository;

  protected PAGE_URL = '/cms-block-gui/list-block';

  getPageUrl(): string {
      return this.PAGE_URL;
  }

  update = (params: UpdateParams): void => {
    this.find({searchQuery: params.query, tableUrl: 'cms-block-gui/list-block/table**'}).then(($storeRow) => {
      cy.wrap($storeRow).as('row');
      cy.get('@row').find(this.repository.getEditButtonSelector()).should('exist').click();
    });
  };

  clickEditAction = (row: JQuery<HTMLElement>): void => {
    cy.wrap(row).find(this.repository.getEditButtonSelector()).should('exist').click();
  };

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}

interface UpdateParams {
  query: string;
}
