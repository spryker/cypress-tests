import { ReturnFixtures } from '../../support';
import { Page as LoginPage } from '../../support/pages/backoffice/login/page';
import { Page as SalesIndexPage } from '../../support/pages/backoffice/sales/index/page';
import { Page as SalesDetailPage } from '../../support/pages/backoffice/sales/detail/page';
import { Page as SalesReturnGuiCreatePage } from '../../support/pages/backoffice/sales-return-gui/create/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { RegisterCustomerScenario } from '../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/place-customer-order-scenario';
import { CliHelper } from '../../support/helpers/cli-helper';
import { container } from '../../support/utils/inversify.config';

describe('create return by user', (): void => {
  let loginPage: LoginPage;
  let salesIndexPage: SalesIndexPage;
  let salesDetailPage: SalesDetailPage;
  let salesReturnGuiCreatePage: SalesReturnGuiCreatePage;
  let cliHelper: CliHelper;

  before((): void => {
    loginPage = container.get(LoginPage);
    salesIndexPage = container.get(SalesIndexPage);
    salesDetailPage = container.get(SalesDetailPage);
    salesReturnGuiCreatePage = container.get(SalesReturnGuiCreatePage);
    cliHelper = container.get(CliHelper);
  });

  beforeEach((): void => {
    cy.resetCookies();

    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      const customer = container.get(RegisterCustomerScenario).execute();
      container.get(LoginCustomerScenario).execute(customer);
      container
        .get(PlaceCustomerOrderScenario)
        .execute(fixtures.concreteProductSkus);
    });

    cliHelper.run('console oms:check-condition');
    cliHelper.run('console oms:check-timeout');
  });

  // ignore uncaught exceptions
  Cypress.on('uncaught:exception', (): boolean => {
    return false;
  });

  it('should be able to create return from Backoffice (from shipped order state) [@regression]', (): void => {
    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      loginPage.login(fixtures.user);
    });

    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from Backoffice (from delivery order state)', (): void => {
    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      loginPage.login(fixtures.user);
    });

    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');
    salesDetailPage.triggerOms('Stock update');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });
});
