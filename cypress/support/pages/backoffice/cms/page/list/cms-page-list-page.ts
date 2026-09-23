import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CmsPageListRepository } from './cms-page-list-repository';

@injectable()
@autoWired
export class CmsPageListPage extends BackofficePage {
  @inject(CmsPageListRepository) private repository: CmsPageListRepository;

  protected PAGE_URL = '/cms-gui/list-page';

  // The grid hydrates via AJAX; the caller asserts this terminal settled cell is visible and
  // Cypress retries until it is, which replaces the Codeception waitForElementVisible.
  getFirstRowFirstCell = (): Cypress.Chainable => this.repository.getFirstRowFirstCell();

  getPublishedMessage = (): Cypress.Chainable => cy.contains(this.repository.getPublishedMessage());
}
