import { ReturnFixtures } from '../../support';
import { Page as LoginPage } from '../../support/pages/backoffice/login/page';
import { Page as SalesPage } from '../../support/pages/backoffice/sales/page';
import { Page as SalesDetailPage } from '../../support/pages/backoffice/sales/detail/page';
import { Page as SalesReturnGuiCreatePage } from '../../support/pages/backoffice/sales-return-gui/create/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { RegisterCustomerScenario } from '../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/place-customer-order-scenario';

describe('create return by user', () => {
  const loginPage = new LoginPage();
  const salesPage = new SalesPage();
  const salesDetailPage = new SalesDetailPage();
  const salesReturnGuiCreatePage = new SalesReturnGuiCreatePage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      LoginCustomerScenario.execute(RegisterCustomerScenario.execute());
      PlaceCustomerOrderScenario.execute(fixtures.concreteProductSkus);
    });
  });

  // ignore uncaught exceptions
  Cypress.on('uncaught:exception', () => {
    return false;
  });

  it('should be able to create return from Backoffice (from shipped order state)', () => {
    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      loginPage.login(fixtures.user);
    });

    salesPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from Backoffice (from delivery order state)', () => {
    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      loginPage.login(fixtures.user);
    });

    salesPage.viewLastPlacedOrder();
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
