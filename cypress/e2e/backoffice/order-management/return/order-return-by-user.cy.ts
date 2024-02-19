import {container} from '../../../../support/utils/inversify/inversify.config';
import {BackofficeLoginPage} from "../../../../support/pages/backoffice/login/backoffice-login-page";
import {BackofficeSalesIndexPage} from "../../../../support/pages/backoffice/sales/index/backoffice-sales-index-page";
import {BackofficeSalesDetailPage} from "../../../../support/pages/backoffice/sales/detail/backoffice-sales-detail-page";
import {BackofficeSalesReturnGuiCreatePage} from "../../../../support/pages/backoffice/sales-return-gui/create/backoffice-sales-return-gui-create-page";
import {OrderReturnByUserDynamicFixtures, OrderReturnByUserStaticFixtures} from "../../../../support/types/backoffice/order-management/return";


// ??? NOT SURE THAT WE SHOULD TEST THIS CASE THROUGH THE UI

describe('create order return by user', (): void => {
  let dynamicFixtures: OrderReturnByUserDynamicFixtures;
  let staticFixtures: OrderReturnByUserStaticFixtures;

  let loginPage: BackofficeLoginPage;
  let salesIndexPage: BackofficeSalesIndexPage;
  let salesDetailPage: BackofficeSalesDetailPage;
  let salesReturnGuiCreatePage: BackofficeSalesReturnGuiCreatePage;

  before((): void => {
    cy.resetBackofficeCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    loginPage = container.get(BackofficeLoginPage);
    salesIndexPage = container.get(BackofficeSalesIndexPage);
    salesDetailPage = container.get(BackofficeSalesDetailPage);
    salesReturnGuiCreatePage = container.get(BackofficeSalesReturnGuiCreatePage);
  });

  beforeEach((): void => {
    // have customer and BO user and order fixtures
    //trigger OMS console oms:check-condition
    //trigger OMS console oms:check-timeout
    loginPage.login(staticFixtures.user.username, staticFixtures.user.password);
  });

  it('should be able to create return from Backoffice (from shipped order state) [@regression]', (): void => {
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
