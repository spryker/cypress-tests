import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PageWorkspacePanel, PageWorkspaceRepository } from './page-workspace-repository';

@injectable()
@autoWired
export class PageWorkspacePage extends BackofficePage {
  @inject(PageWorkspaceRepository) private repository: PageWorkspaceRepository;

  protected PAGE_URL = '/content-experience-management/page-workspace';

  getHeader = (): Cypress.Chainable => this.repository.getHeader();

  getStatus = (): Cypress.Chainable => this.repository.getStatus();

  getPanel = (panel: PageWorkspacePanel): Cypress.Chainable => this.repository.getPanel(panel);

  toggleActive = (): void => {
    this.repository.getToggleActiveButton().click();
  };

  getDeactivatedMessage = (): Cypress.Chainable => cy.contains(this.repository.getDeactivatedMessage());
}
