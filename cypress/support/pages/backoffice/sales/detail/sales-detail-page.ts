import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SalesDetailRepository } from './sales-detail-repository';

const OMS_CONSOLE_COMMANDS = ['console oms:check-condition', 'console oms:check-timeout'];

const OMS_RELOAD_ATTEMPTS = 25;

const OMS_RELOAD_INTERVAL_MS = 5000;

@injectable()
@autoWired
export class SalesDetailPage extends BackofficePage {
  @inject(SalesDetailRepository) private repository: SalesDetailRepository;

  protected PAGE_URL = '/sales/detail';

  triggerOms = (params: TriggerOmsParams): void => {
    const repositoryId = Cypress.env('repositoryId');

    // skip picking is only available for suite, b2c and b2c-mp repositories
    if (params.state === 'skip picking' && !['suite', 'b2c', 'b2c-mp'].includes(repositoryId)) {
      return;
    }

    if (params.shouldTriggerOmsInCli) {
      cy.runCliCommands(OMS_CONSOLE_COMMANDS);
    }

    cy.url().then((url) => {
      cy.reloadUntilFound(
        this.buildBackofficeUrl(url),
        this.repository.getOmsButtonSelector(params.state),
        this.repository.getTriggerOmsDivSelector(),
        OMS_RELOAD_ATTEMPTS,
        OMS_RELOAD_INTERVAL_MS,
        params.shouldTriggerOmsInCli ? OMS_CONSOLE_COMMANDS : []
      );

      cy.get(this.repository.getTriggerOmsDivSelector())
        .find(this.repository.getOmsButtonSelector(params.state))
        .click();
    });
  };

  triggerOmsForOrderItem = (params: TriggerOmsForOrderItemParams): void => {
    const buttonSelector = this.repository.getOrderItemOmsButtonSelector(params.sku, params.state);

    cy.url().then((url) => {
      cy.reloadUntilFound(
        this.buildBackofficeUrl(url),
        buttonSelector,
        'body',
        OMS_RELOAD_ATTEMPTS,
        OMS_RELOAD_INTERVAL_MS,
        OMS_CONSOLE_COMMANDS
      );

      cy.get(buttonSelector).click();
    });
  };

  create = (): void => {
    this.repository.getReturnButton().click();
  };

  getTotalCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.contains('Total Commission').parent().parent().parent();
  };

  getTotalRefundedCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.contains('Total Refunded Commission').parent().parent().parent();
  };

  getOrderItemTables = (): Cypress.Chainable => this.repository.getOrderItemTables();

  getShipmentDeliveryAddresses = (): Cypress.Chainable => this.repository.getShipmentDeliveryAddresses();

  getOrderComments = (): Cypress.Chainable => this.repository.getOrderComments();

  getBillingAddress = (): Cypress.Chainable => this.repository.getBillingAddress();

  waitForOrderItemState = (params: WaitForOrderItemStateParams): void => {
    cy.url().then((url) => {
      cy.reloadUntilFound(
        this.buildBackofficeUrl(url),
        this.repository.getOrderItemStateSelector(params.state, params.sku),
        'body',
        OMS_RELOAD_ATTEMPTS,
        OMS_RELOAD_INTERVAL_MS,
        OMS_CONSOLE_COMMANDS
      );
    });
  };

  // cy.url() drops the basic-auth credentials that SE envs need, so the path is re-hung on the
  // configured back-office base url rather than reloaded as-is.
  private buildBackofficeUrl = (url: string): string => {
    const currentUrl = new URL(url);
    const targetUrl = new URL(Cypress.env('backofficeUrl'));

    targetUrl.pathname = currentUrl.pathname;
    targetUrl.search = currentUrl.search;

    return targetUrl.toString();
  };
}

interface TriggerOmsParams {
  state: string;
  shouldTriggerOmsInCli?: boolean;
}

interface TriggerOmsForOrderItemParams {
  sku: string;
  state: string;
}

interface WaitForOrderItemStateParams {
  state: string;
  sku: string;
}
