import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SearchByImageRepository } from './search-by-image-repository';

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
  enableSearchByImage = (): Cypress.Chainable => {
    cy.visitBackoffice(this.CONFIGURATION_URL);

    cy.get(this.repository.getEnableToggleSelector()).then(($toggle) => {
      if (!($toggle[0] as HTMLInputElement).checked) {
        cy.wrap($toggle).check({ force: true });

        cy.intercept('POST', '**/configuration/manage/save').as('saveConfiguration');
        cy.get(this.repository.getSaveButtonSelector()).click();
        cy.wait('@saveConfiguration').its('response.statusCode').should('eq', 200);
      }
    });

    // Publish & Synchronize the saved value into Yves' Redis storage (see method doc-block):
    // drain the publish queue (value -> spy_configuration_storage) then sync that row to Redis.
    cy.runQueueWorker();
    cy.runCliCommands([this.SYNC_CONFIGURATION_COMMAND]);

    return cy.get(this.repository.getEnableToggleSelector()).should('be.checked');
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
}
