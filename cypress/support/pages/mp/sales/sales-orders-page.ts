import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage, ActionEnum } from '@pages/mp';
import { SalesOrdersRepository } from './sales-orders-repository';

@injectable()
@autoWired
export class SalesOrdersPage extends MpPage {
  @inject(SalesOrdersRepository) private repository: SalesOrdersRepository;

  protected PAGE_URL = '/sales-merchant-portal-gui/orders';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector, { timeout: params.timeout ?? Cypress.config('defaultCommandTimeout') }).clear();
    cy.get(searchSelector).type(params.query, { delay: 0 });
    this.repository.getFirstTableRow({ timeout: 20000 });

    this.interceptTable(
      {
        url: '/sales-merchant-portal-gui/orders/table-data**',
        expectedCount: params.expectedCount,
      },
      () => {
        cy.get(searchSelector).type('{enter}');
      }
    );

    return this.repository.getTableRowContaining(params.query);
  };

  update = (params: UpdateParams): void => {
    this.find({ query: params.query }).click({ force: true });
    this.triggerDrawerAction(this.getActionButtonSelector(params.action));
  };

  private triggerDrawerAction = (actionButtonSelector: string): void => {
    const triggerAlias = this.faker.string.uuid();
    cy.intercept({ pathname: '/sales-merchant-portal-gui/trigger-merchant-oms' }).as(triggerAlias);

    this.repository.getDrawer().find(actionButtonSelector, { timeout: 10000 }).click();

    cy.wait(`@${triggerAlias}`);
  };

  private getActionButtonSelector = (action: ActionEnum): string => {
    const actionButtonSelectors: Record<ActionEnum, string> = {
      [ActionEnum.sendToDistribution]: this.repository.getSendToDistributionButtonSelector(),
      [ActionEnum.confirmAtCenter]: this.repository.getConfirmAtCenterButtonSelector(),
      [ActionEnum.ship]: this.repository.getShipButtonSelector(),
      [ActionEnum.deliver]: this.repository.getDeliverButtonSelector(),
      [ActionEnum.cancel]: this.repository.getCancelButtonSelector(),
      [ActionEnum.refund]: this.repository.getRefundButtonSelector(),
    };

    return actionButtonSelectors[action];
  };

  hasOrderByOrderReference = (query: string): Cypress.Chainable<boolean> => {
    return cy.get('tbody').then((body) => {
      if (body.find(`tr:contains("${query}")`).length > 0) {
        return cy.wrap(true);
      } else {
        return cy.wrap(false);
      }
    });
  };

  getTotalCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return this.repository.getDrawer().contains('Total Commission').parent();
  };

  getTotalRefundedCommissionBlock = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return this.repository.getDrawer().contains('Total Refunded Commission').parent();
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
  waitUntilOrderIsVisible?: boolean;
  timeout?: number;
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
