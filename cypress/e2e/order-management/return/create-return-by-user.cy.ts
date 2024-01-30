import { container } from '../../../support/utils/inversify/inversify.config';
import { BackofficeLoginPage } from '../../../support/pages/backoffice/login/backoffice-login-page';
import { BackofficeSalesIndexPage } from '../../../support/pages/backoffice/sales/index/backoffice-sales-index-page';
import { BackofficeSalesDetailPage } from '../../../support/pages/backoffice/sales/detail/backoffice-sales-detail-page';
import { BackofficeSalesReturnGuiCreatePage } from '../../../support/pages/backoffice/sales-return-gui/create/backoffice-sales-return-gui-create-page';
import { RegisterCustomerScenario } from '../../../support/scenarios/yves/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../../support/scenarios/yves/place-customer-order-scenario';
import { YvesLoginCustomerScenario } from '../../../support/scenarios/yves/yves-login-customer-scenario';

describe('create return by user', (): void => {
  const loginPage: BackofficeLoginPage = container.get(BackofficeLoginPage);
  const salesIndexPage: BackofficeSalesIndexPage = container.get(BackofficeSalesIndexPage);
  const salesDetailPage: BackofficeSalesDetailPage = container.get(BackofficeSalesDetailPage);
  const salesReturnGuiCreatePage: BackofficeSalesReturnGuiCreatePage = container.get(
    BackofficeSalesReturnGuiCreatePage
  );

  const registerCustomerScenario: RegisterCustomerScenario = container.get(RegisterCustomerScenario);
  const loginCustomerScenario: YvesLoginCustomerScenario = container.get(YvesLoginCustomerScenario);
  const placeCustomerOrderScenario: PlaceCustomerOrderScenario = container.get(PlaceCustomerOrderScenario);

  let fixtures: CreateReturnByUserFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
    cy.resetBackofficeCookies();

    const customer = registerCustomerScenario.execute();
    loginCustomerScenario.execute(customer);
    placeCustomerOrderScenario.execute(fixtures.concreteProductSkus);
  });

  it('should be able to create return from Backoffice (from shipped order state)', (): void => {
    loginPage.login(fixtures.user);

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
    loginPage.login(fixtures.user);

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
