import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SearchByImageRepository } from './search-by-image-repository';

interface SearchByImageInterception {
  response?: {
    statusCode?: number;
    body?: { isSuccessful?: boolean; redirectUrl?: string };
  };
}

@injectable()
@autoWired
export class SearchByImagePage extends YvesPage {
  @inject(SearchByImageRepository) private repository: SearchByImageRepository;

  protected PAGE_URL = '/en/search?q=cable';

  private CONFIGURATION_URL = '/configuration/manage?feature=ai_commerce&tab=search_by_image';

  private SYNC_CONFIGURATION_COMMAND = 'console sync:data configuration';

  enableSearchByImage = (): Cypress.Chainable => this.setSearchByImageEnabled(true);

  setSearchByImageEnabled = (enabled: boolean): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (($toggle[0] as HTMLInputElement).checked === enabled) {
        return;
      }

      if (enabled) {
        cy.wrap($toggle).check({ force: true });
      } else {
        cy.wrap($toggle).uncheck({ force: true });
      }

      cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
      cy.get(this.repository.getSaveButtonSelector()).click();
      cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
    });

    cy.runQueueWorker();
    cy.runCliCommands([this.SYNC_CONFIGURATION_COMMAND]);

    return cy.get(this.repository.getEnableToggleSelector()).should(enabled ? 'be.checked' : 'not.be.checked');
  };

  visitSearchResults = (): Cypress.Chainable => {
    cy.intercept('GET', '**/search**').as('searchResultsDocument');
    this.visit();

    return cy.wait('@searchResultsDocument');
  };

  getWrapper = (): Cypress.Chainable => cy.get(this.repository.getWrapperSelector());

  getFileButton = (): Cypress.Chainable => cy.get(this.repository.getFileButtonSelector());

  getPhotoButton = (): Cypress.Chainable => cy.get(this.repository.getPhotoButtonSelector());

  getFileInput = (): Cypress.Chainable => cy.get(this.repository.getFileInputSelector());

  getToken = (): Cypress.Chainable => cy.get(this.repository.getTokenSelector());

  getDesktopInstance = (): Cypress.Chainable => cy.get(this.repository.getDesktopInstanceSelector());

  clickFileTrigger = (): void => {
    this.getDesktopInstance().find(this.repository.getFileButtonSelector()).click({ force: true });
  };

  getOpenFilePopupUploadButton = (): Cypress.Chainable =>
    cy.get(this.repository.getOpenFilePopupSelector()).find(this.repository.getUploadFileButtonSelector());

  interceptSearchByImageRequest = (): void => {
    cy.intercept('POST', '**/search-by-image').as('searchByImageRequest');
  };

  stubSearchByImageFailure = (
    errors: string[] = ['Search by Image is currently unavailable. Please try again later.']
  ): void => {
    cy.intercept('POST', '**/search-by-image', {
      statusCode: 200,
      body: { isSuccessful: false, errors },
    }).as('searchByImageRequest');
  };

  stubSearchByImageServerError = (): void => {
    cy.intercept('POST', '**/search-by-image', {
      statusCode: 503,
      body: {},
    }).as('searchByImageRequest');
  };

  getFilePopupError = (): Cypress.Chainable =>
    cy.get(this.repository.getOpenFilePopupSelector()).find(this.repository.getFilePopupErrorSelector());

  getFilePopupErrorItems = (): Cypress.Chainable =>
    cy.get(this.repository.getOpenFilePopupSelector()).find(this.repository.getFilePopupErrorItemSelector());

  getInstances = (): Cypress.Chainable => cy.get(this.repository.getSearchByImageInstanceSelector());

  getDesktopFileSearchButton = (): Cypress.Chainable =>
    this.getDesktopInstance().find(this.repository.getFileButtonSelector());

  getFileInputSelector = (): string => this.repository.getFileInputSelector();

  getTokenSelector = (): string => this.repository.getTokenSelector();

  attachImage = (filePath: string): void => {
    this.getDesktopInstance().find(this.repository.getFileInputSelector()).selectFile(filePath, { force: true });
  };

  submitImageThroughFilePopup = (filePath: string): void => {
    this.clickFileTrigger();
    this.getOpenFilePopupUploadButton().should('be.visible').and('not.be.disabled');
    this.attachImage(filePath);
  };

  getResultsPageSurface = (): Cypress.Chainable =>
    cy.get(this.repository.getResultsPageSurfaceSelector(), { timeout: 30000 });

  getEndpointUrl = (): string => `${Cypress.config('baseUrl')}${this.repository.getEndpointPath()}`;

  getNoImageErrorText = (): string => this.repository.getNoImageErrorText();

  getCsrfErrorMarker = (): string => this.repository.getCsrfErrorMarker();

  getUnsupportedTypeErrorMarker = (): string => this.repository.getUnsupportedTypeErrorMarker();

  buildMultipartBody = (params: {
    boundary: string;
    fileName: string;
    contentType: string;
    contents: string;
    token: string;
  }): string =>
    `--${params.boundary}\r\n` +
    `Content-Disposition: form-data; name="search_by_image[image]"; filename="${params.fileName}"\r\n` +
    `Content-Type: ${params.contentType}\r\n\r\n` +
    `${params.contents}\r\n` +
    `--${params.boundary}\r\n` +
    'Content-Disposition: form-data; name="search_by_image[_token]"\r\n\r\n' +
    `${params.token}\r\n` +
    `--${params.boundary}--\r\n`;

  requestEndpoint = (
    method: string,
    options: { body?: string; contentType?: string } = {}
  ): Cypress.Chainable<Cypress.Response<{ isSuccessful?: boolean; errors?: unknown; redirectUrl?: string }>> =>
    cy.request({
      method,
      url: this.getEndpointUrl(),
      failOnStatusCode: false,
      headers: options.contentType ? { 'content-type': options.contentType } : undefined,
      body: options.body,
    });

  submitImageThroughFilePopupUntilSuccessful = (
    filePath: string,
    { maxAttempts = 3, timeout = 30000 }: { maxAttempts?: number; timeout?: number } = {}
  ): Cypress.Chainable => {
    const isSuccessful = (interception: SearchByImageInterception | undefined): boolean =>
      ((interception?.response?.statusCode ?? 0) >= 200 &&
        (interception?.response?.statusCode ?? 0) < 300 &&
        interception?.response?.body?.isSuccessful === true) ||
      false;

    const pollForSuccess = (deadline: number): Cypress.Chainable<SearchByImageInterception | undefined> =>
      cy.get('@searchByImageRequest.all').then((subject) => {
        const calls = subject as unknown as Array<SearchByImageInterception>;
        const successful = calls.filter(isSuccessful).pop();

        if (successful) {
          return cy.wrap<SearchByImageInterception | undefined>(successful, { log: false });
        }

        if (Date.now() >= deadline) {
          return cy.wrap<SearchByImageInterception | undefined>(undefined, { log: false });
        }

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        return cy.wait(pollIntervalMs, { log: false }).then(() => pollForSuccess(deadline));
      });

    const pollIntervalMs = 1000;

    const attempt = (remainingAttempts: number): Cypress.Chainable => {
      this.visitSearchResults();
      this.interceptSearchByImageRequest();
      this.submitImageThroughFilePopup(filePath);

      return cy
        .then(() => pollForSuccess(Date.now() + timeout))
        .then((successful: SearchByImageInterception | undefined) => {
          if (successful || remainingAttempts <= 1) {
            return successful ?? cy.wait('@searchByImageRequest', { timeout });
          }

          return attempt(remainingAttempts - 1);
        });
    };

    return attempt(maxAttempts);
  };
}
