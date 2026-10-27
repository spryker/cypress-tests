import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PagePublishResultRepository } from './page-publish-result-repository';

@injectable()
@autoWired
export class PagePublishResultPage extends BackofficePage {
  @inject(REPOSITORIES.PagePublishResultRepository) private repository: PagePublishResultRepository;

  protected PAGE_URL = '/content-experience-management/page-workspace/publish-result';

  getSummary = (): Cypress.Chainable => this.repository.getSummary();

  getLocales = (): Cypress.Chainable => this.repository.getLocales();

  getUrls = (): Cypress.Chainable => this.repository.getUrls();

  getViewLiveLink = (): Cypress.Chainable => this.repository.getViewLiveLink();

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  getErrorMessage = (): Cypress.Chainable => this.repository.getErrorMessage();

  getUndoUnavailable = (): Cypress.Chainable => this.repository.getUndoUnavailable();

  getUndoModal = (): Cypress.Chainable => this.repository.getUndoModal();

  undoPublish = (): void => {
    this.repository.getUndoOpenButton().click();
    this.repository.getUndoConfirmButton().click();
  };

  backToWorkspace = (): void => {
    this.repository.getBackToWorkspaceLink().click();
  };
}
