import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { AgentDashboardRepository } from './agent-dashboard-repository';

// Network-idle tuning: the dashboard must stay quiet (no in-flight requests) for this long to be settled.
const NETWORK_IDLE_THRESHOLD_MS = 700;
const NETWORK_IDLE_POLL_INTERVAL_MS = 150;
const NETWORK_IDLE_MAX_POLLS = 80;

@injectable()
@autoWired
export class AgentDashboardPage extends MpPage {
  @inject(AgentDashboardRepository) private repository: AgentDashboardRepository;

  protected PAGE_URL = '/agent-dashboard-merchant-portal-gui/merchant-users';

  // The merchant-users dashboard loads several async requests (datatable, menu, notifications, ...) that
  // each rewrite the whole (non-locking) session. If we navigate away while any is still in flight, its
  // write can overwrite the CSRF token freshly minted by the next page (MFA set-up) -> flaky
  // "could not be activated/deactivated". So we visit and then wait for the network to go fully idle, so
  // every dashboard request has committed its session write before we move on. Kept separate from visit()
  // so other agent tests are unaffected.
  visitAndWaitForNetworkIdle = (options?: Partial<Cypress.VisitOptions>): void => {
    const tracker = this.trackInFlightRequests();
    cy.visitMerchantPortal(this.PAGE_URL, options);
    this.waitForNetworkIdle(tracker);
  };

  private trackInFlightRequests = (): NetworkActivityTracker => {
    const tracker: NetworkActivityTracker = { seen: 0, inFlight: 0, lastActivityAt: 0 };

    // middleware:true runs before scenario intercepts and passes through, so it only counts traffic.
    cy.intercept({ url: '**', middleware: true }, (req) => {
      tracker.seen += 1;
      tracker.inFlight += 1;
      tracker.lastActivityAt = Date.now();
      req.on('response', () => {
        tracker.inFlight -= 1;
        tracker.lastActivityAt = Date.now();
      });
    });

    return tracker;
  };

  private waitForNetworkIdle = (tracker: NetworkActivityTracker, pollsLeft: number = NETWORK_IDLE_MAX_POLLS): void => {
    cy.then(() => {
      const isIdle =
        tracker.seen > 0 && tracker.inFlight === 0 && Date.now() - tracker.lastActivityAt >= NETWORK_IDLE_THRESHOLD_MS;

      if (isIdle || pollsLeft <= 0) {
        return;
      }

      // Controlled poll interval (not an arbitrary wait-and-hope): re-check network activity after a tick.
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(NETWORK_IDLE_POLL_INTERVAL_MS, { log: false }).then(() =>
        this.waitForNetworkIdle(tracker, pollsLeft - 1)
      );
    });
  };

  assist = (params: AssistParams): void => {
    const findParams = { query: params.query, expectedCount: 1 };

    this.find(findParams).then(($merchantUserRow) => {
      cy.wrap($merchantUserRow)
        .find(this.repository.getAssistUserButtonSelector())
        .should('exist')
        .click({ force: true });
      this.repository.getModalConfirmButton().click();
    });
  };

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    cy.get(searchSelector).type('{enter}');

    this.interceptTable({
      url: '/agent-dashboard-merchant-portal-gui/merchant-users/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDashboardSidebarSelector = (): Cypress.Chainable => {
    return this.repository.getDashboardSidebarSelector();
  };

  getEndUserAssistanceSelector = (): string => {
    return this.repository.getEndUserAssistanceSelector();
  };

  getLogoutAgentSelector = (): string => {
    return this.repository.getLogoutAgentSelector();
  };

  logoutAgent = (): void => {
    this.repository.getUserMenu().click();
    cy.contains('a', 'Logout').click({ force: true });
  };
}

interface NetworkActivityTracker {
  seen: number;
  inFlight: number;
  lastActivityAt: number;
}

interface AssistParams {
  query: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
