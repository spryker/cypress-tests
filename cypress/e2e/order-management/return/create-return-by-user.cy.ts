import { Page as LoginPage } from '../../../support/pages/backoffice/login/page';
import { Page as SalesIndexPage } from '../../../support/pages/backoffice/sales/index/page';
import { Page as SalesDetailPage } from '../../../support/pages/backoffice/sales/detail/page';
import { Page as SalesReturnGuiCreatePage } from '../../../support/pages/backoffice/sales-return-gui/create/page';
import { LoginCustomerScenario } from '../../../support/scenarios/login-customer-scenario';
import { RegisterCustomerScenario } from '../../../support/scenarios/register-customer-scenario';
import { PlaceCustomerOrderScenario } from '../../../support/scenarios/place-customer-order-scenario';
import { CliHelper } from '../../../support/helpers/cli-helper';
import { container } from '../../../support/utils/inversify/inversify.config';

describe('create return by user', (): void => {
  let fixtures: CreateReturnByUserFixtures;

  let loginPage: LoginPage;
  let salesIndexPage: SalesIndexPage;
  let salesDetailPage: SalesDetailPage;
  let salesReturnGuiCreatePage: SalesReturnGuiCreatePage;
  let cliHelper: CliHelper;
  let registerCustomerScenario: RegisterCustomerScenario;
  let loginCustomerScenario: LoginCustomerScenario;
  let placeCustomerOrderScenario: PlaceCustomerOrderScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    loginPage = container.get(LoginPage);
    salesIndexPage = container.get(SalesIndexPage);
    salesDetailPage = container.get(SalesDetailPage);
    salesReturnGuiCreatePage = container.get(SalesReturnGuiCreatePage);
    cliHelper = container.get(CliHelper);
    registerCustomerScenario = container.get(RegisterCustomerScenario);
    loginCustomerScenario = container.get(LoginCustomerScenario);
    placeCustomerOrderScenario = container.get(PlaceCustomerOrderScenario);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();
    cy.resetBackofficeCookies();

    const customer = registerCustomerScenario.execute();
    loginCustomerScenario.execute(customer);
    placeCustomerOrderScenario.execute(fixtures.concreteProductSkus);

    cliHelper.run('console oms:check-condition');
    cliHelper.run('console oms:check-timeout');
  });

  it('should be able to create return from Backoffice (from shipped order state) [@regression]', (): void => {
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
