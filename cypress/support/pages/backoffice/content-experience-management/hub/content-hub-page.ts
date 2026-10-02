import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ContentHubRepository, ContentHubTab } from './content-hub-repository';

@injectable()
@autoWired
export class ContentHubPage extends BackofficePage {
  @inject(ContentHubRepository) private repository: ContentHubRepository;

  protected PAGE_URL = '/content-experience-management/page-list';

  visitTab = (tab: ContentHubTab): void => {
    cy.visitBackoffice(`/content-experience-management/${tab}`);
  };

  openTab = (tab: ContentHubTab): void => {
    this.repository.getTab(tab).click();
  };

  search = (searchTerm: string): void => {
    this.repository.getSearchInput().clear().type(searchTerm);
    this.repository.getSearchButton().click();
  };

  getSearchInput = (): Cypress.Chainable => this.repository.getSearchInput();

  getTableRow = (text: string): Cypress.Chainable => this.repository.getTableRow(text);

  openWorkspace = (pageName: string): void => {
    this.repository.getTableRow(pageName).find(this.repository.getWorkspaceLinkSelector()).click();
  };

  openUsage = (rowText: string): void => {
    this.repository.getTableRow(rowText).find(this.repository.getUsageLinkSelector()).click();
  };
}
