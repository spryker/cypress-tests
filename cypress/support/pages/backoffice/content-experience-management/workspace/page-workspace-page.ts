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

  openBuilder = (): void => {
    this.repository.getOpenBuilderButton().click();
  };

  openPublishModal = (): void => {
    this.repository.getPublishButton().click();
  };

  getPublishModal = (): Cypress.Chainable => this.repository.getPublishModal();

  confirmPublish = (): void => {
    this.repository.getPublishConfirmButton().click();
  };

  cancelPublish = (): void => {
    this.repository.getPublishCancelButton().click();
  };

  publish = (): void => {
    this.openPublishModal();
    this.confirmPublish();
  };

  openDeactivateModal = (): void => {
    this.repository.getToggleActiveButton().click();
  };

  getDeactivateModal = (): Cypress.Chainable => this.repository.getDeactivateModal();

  confirmDeactivate = (): void => {
    this.repository.getDeactivateConfirmButton().click();
  };

  deactivate = (): void => {
    this.openDeactivateModal();
    this.confirmDeactivate();
  };

  activate = (): void => {
    this.repository.getToggleActiveButton().click();
  };

  getDeactivatedMessage = (): Cypress.Chainable => cy.contains(this.repository.getDeactivatedMessage());

  getActivatedMessage = (): Cypress.Chainable => cy.contains(this.repository.getActivatedMessage());
}
