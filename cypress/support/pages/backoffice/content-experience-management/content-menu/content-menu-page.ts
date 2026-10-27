import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ContentMenuRepository } from './content-menu-repository';

@injectable()
@autoWired
export class ContentMenuPage extends BackofficePage {
  @inject(REPOSITORIES.ContentMenuRepository) private repository: ContentMenuRepository;

  protected PAGE_URL = '/content-experience-management/home';

  getContentMenuEntries = (): Cypress.Chainable =>
    this.repository
      .getContentMenuHomeLink()
      .closest(this.repository.getContentMenuSubmenuSelector())
      .find(this.repository.getContentMenuEntrySelector());

  getMenuLinkByUrl = (url: string): Cypress.Chainable => this.repository.getMenuLinkByUrl(url);

  visitLegacyPage = (url: string): void => {
    cy.visitBackoffice(url);
  };

  getDataTable = (): Cypress.Chainable => this.repository.getDataTable();
}
