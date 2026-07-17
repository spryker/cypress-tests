import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CmsPageListRepository } from './cms-page-list-repository';

@injectable()
@autoWired
export class CmsPageListPage extends BackofficePage {
  @inject(CmsPageListRepository) private repository: CmsPageListRepository;

  protected PAGE_URL = '/cms-gui/list-page';

  // Mirrors the Codeception waitForElementVisible on the DataTables first-row/first-cell:
  // the grid hydrates via AJAX, so assert the terminal settled cell is visible (Cypress
  // retries the assertion) instead of a fixed wait.
  assertPageListTableVisible = (): void => {
    this.repository.getFirstRowFirstCell().should('be.visible');
  };
}
