import { RegisterCustomerScenario } from '../../support/scenarios/register-customer.scenario';
import { PlaceCustomerOrderScenario } from '../../support/scenarios/place-customer-order.scenario';
import { Page } from '../../support/pages/backoffice/login/page';
import { Page } from '../../support/pages/backoffice/sales/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer.scenario';
import { Page } from '../../support/pages/backoffice/sales/detail/page';
import { Page } from '../../support/pages/backoffice/sales-return-gui/create/page';
import { ReturnFixtures } from '../../support';

describe('create return by user', () => {
  const loginPage = new Page();
  const salesPage = new Page();
  const salesDetailPage = new Page();
  const createReturnPage = new Page();

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
      loginPage.login(fixtures.user.email, fixtures.user.password);
    });
    salesPage.viewLastPlacedOrder();

    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    createReturnPage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from Backoffice (from delivery order state)', () => {
    cy.fixture('return').then((fixtures: ReturnFixtures) => {
      loginPage.login(fixtures.user.email, fixtures.user.password);
    });
    salesPage.viewLastPlacedOrder();

    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');
    salesDetailPage.triggerOms('Stock update');

    salesDetailPage.createReturn();
    createReturnPage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });
});
