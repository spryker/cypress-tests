import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SearchByImageRepository } from './search-by-image-repository';

/**
 * Minimal shape of a captured search-by-image interception (from `cy.intercept` alias `.all`) that the
 * real-provider retry helper reads. Kept local because the Cypress namespace does not export a stable
 * `Interception`/`WaitXHR` type across versions.
 */
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

  /**
   * Enables the Search by Image feature for the storefront. Two distinct steps are required because
   * Yves does NOT read this toggle from the database — it reads it from Redis via Publish & Synchronize:
   *
   *   1. Enable the flag through the Back Office Configuration Management UI (idempotent: only toggles
   *      when currently off). The Save action is a plain config-save POST (`/configuration/manage/save`),
   *      NOT an AI provider call.
   *   2. Propagate the saved value to Yves' Redis storage. The save enqueues a `spy_configuration_value`
   *      entity event on the `publish` queue; the queue worker processes it into
   *      `spy_configuration_storage`, and `sync:data configuration` exports that row to the
   *      `kv:configuration:global` Redis key the Yves config client reads.
   *
   * SCOPED CONSOLE-COMMAND EXCEPTION (approved): the demo Cypress group is otherwise UI-only with no
   * CLI/seeding. This single spec is an explicit, approved exception because Search by Image is the
   * only storefront-read AI toggle, and this dev/CI environment has no continuously running queue
   * worker — so a UI save alone never reaches Yves. The commands are plain P&S plumbing (no data
   * seeding, no AI provider, no token) and run via the project-native `cy.runQueueWorker()` /
   * `cy.runCliCommands()` helpers, which execute console commands server-side through the Glue Backend
   * `/dynamic-fixtures` endpoint — runner-independent, so they do not depend on `docker/sdk` being
   * reachable from the host running Cypress.
   */
  enableSearchByImage = (): Cypress.Chainable => this.setSearchByImageEnabled(true);

  /**
   * Sets the Search by Image toggle to the desired state through the Back Office Configuration
   * Management UI and propagates it to Yves' Redis storage via Publish & Synchronize. Idempotent:
   * only saves when the current checkbox state differs from the target. See the enable rationale in
   * the class-level P&S note — the Save is a plain config-save POST (no AI provider, no token) and the
   * queue-drain + `sync:data configuration` commands are the P&S plumbing that reaches the Yves config
   * client. Used both to enable for the main suite and to exercise the disabled empty-wrapper state.
   */
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

    // Publish & Synchronize the saved value into Yves' Redis storage (see method doc-block):
    // drain the publish queue (value -> spy_configuration_storage) then sync that row to Redis.
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

  /**
   * Stubs the search-by-image endpoint with a provider-less failure response so the front-end error
   * path can be exercised without a real AI provider token. The controller returns HTTP 200 with an
   * `isSuccessful:false` body on any failure (validation, provider outage, disabled feature); the JS
   * `sendFile()` branch treats `!isSuccessful` uniformly and renders `errors` into the popup error list.
   */
  stubSearchByImageFailure = (
    errors: string[] = ['Search by Image is currently unavailable. Please try again later.']
  ): void => {
    cy.intercept('POST', '**/search-by-image', {
      statusCode: 200,
      body: { isSuccessful: false, errors },
    }).as('searchByImageRequest');
  };

  /**
   * Stubs the endpoint with a transport-level failure (HTTP 503) to prove the front-end does not crash
   * when the AJAX provider rejects — the `sendFile()` promise rejects, `processAndSubmitFile()` catches
   * it and dispatches SHOW_ERROR, leaving the search-by-image element intact and re-usable.
   */
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

  // Landed-on-a-search-results-page assertion that tolerates a zero-match real-provider search (see the
  // repository selector doc): product tiles OR the empty-catalog state OR the results tabs shell.
  getResultsPageSurface = (): Cypress.Chainable =>
    cy.get(this.repository.getResultsPageSurfaceSelector(), { timeout: 30000 });

  /**
   * Submits the probe image against a REAL AI provider and retries the whole submit (re-visit search
   * results, re-intercept, re-open the file popup, re-attach) up to `maxAttempts` times until the
   * provider actually returns a successful response. A single real-provider round-trip can transiently
   * error, return `isSuccessful:false`, OR never respond within the window (Bedrock/OpenAI hiccups) — a
   * real user just tries again, so this mirrors that instead of hard-failing on one flaky call.
   *
   * Crucially it treats a NON-RESPONSE the same as an unsuccessful response: rather than a bare
   * `cy.wait('@alias')` (which throws an un-catchable CypressError the moment the window elapses without
   * a response), it polls the alias's captured calls with `cy.get('@alias.all')` under a per-attempt
   * timeout and, if no successful call has landed by then, moves on to the next attempt. Fails only when
   * every attempt is exhausted; returns the last successful interception.
   */
  submitImageThroughFilePopupUntilSuccessful = (
    filePath: string,
    { maxAttempts = 3, timeout = 30000 }: { maxAttempts?: number; timeout?: number } = {}
  ): Cypress.Chainable => {
    const isSuccessful = (interception: SearchByImageInterception | undefined): boolean =>
      ((interception?.response?.statusCode ?? 0) >= 200 &&
        (interception?.response?.statusCode ?? 0) < 300 &&
        interception?.response?.body?.isSuccessful === true) ||
      false;

    // Polls the alias's captured calls WITHOUT cy.wait/should (both throw on timeout and would defeat the
    // retry). Reads `@alias.all` every `pollIntervalMs` up to `timeout`, resolving the first successful
    // interception or `undefined` when the window elapses with none — never failing the test itself.
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

        // Deliberate fixed-interval poll of a real network alias (not an arbitrary UI sleep): we re-read
        // the captured calls until a successful provider response lands or the per-attempt deadline passes.
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
            // Final attempt: surface the real interception, or do one authoritative cy.wait so an
            // all-attempts-failed run reports an honest timeout rather than a silent undefined.
            return successful ?? cy.wait('@searchByImageRequest', { timeout });
          }

          return attempt(remainingAttempts - 1);
        });
    };

    return attempt(maxAttempts);
  };
}
