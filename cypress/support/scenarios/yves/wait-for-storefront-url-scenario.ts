import { autoWired } from '@utils';
import { injectable } from 'inversify';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

// A store that no longer carries a page answers with a redirect to its own error page instead of a
// bare 404, so "not found" is recognised by that target as well.
const NOT_FOUND_PAGE_PATH = 'error-page/404';

// Publish and synchronize is asynchronous; every attempt drains the queue again before re-reading the
// storefront.
const PUBLISH_AND_SYNC_ATTEMPTS = 10;

@injectable()
@autoWired
export class WaitForStorefrontUrlScenario {
  execute = (params: ExecuteParams, attemptsLeft = PUBLISH_AND_SYNC_ATTEMPTS): void => {
    cy.request({ url: params.url, failOnStatusCode: false, followRedirect: false }).then((response) => {
      const isServed = response.status === HTTP_STATUS_OK;
      const isNotFound =
        response.status === HTTP_STATUS_NOT_FOUND || String(response.redirectedToUrl).includes(NOT_FOUND_PAGE_PATH);
      const isExpected = params.shouldBeServed ? isServed : isNotFound;

      if (isExpected || attemptsLeft === 0) {
        expect(isExpected, `store url ${params.url} ${params.shouldBeServed ? 'is served' : 'is not found'}`).to.equal(
          true
        );

        return;
      }

      cy.runQueueWorker();
      this.execute(params, attemptsLeft - 1);
    });
  };
}

interface ExecuteParams {
  url: string;
  shouldBeServed: boolean;
}
