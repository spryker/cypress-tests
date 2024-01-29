import { container } from '../../support/utils/inversify/inversify.config';
import { PlaceGuestMpOrderScenario } from '../../support/scenarios/yves/place-guest-mp-order-scenario';
import { ImpersonateAsMerchantUserScenario } from '../../support/scenarios/mp/impersonate-as-merchant-user-scenario';
import { CliHelper } from '../../support/helpers/cli-helper';
import { BackofficeLoginUserScenario } from '../../support/scenarios/backoffice/backoffice-login-user-scenario';
import { BackofficeSalesIndexPage } from '../../support/pages/backoffice/sales/index/backoffice-sales-index-page';
import { BackofficeSalesDetailPage } from '../../support/pages/backoffice/sales/detail/backoffice-sales-detail-page';
import { MpSalesOrdersPage } from '../../support/pages/mp/sales/mp-sales-orders-page';
import { MpProfilePage } from '../../support/pages/mp/profile/mp-profile-page';
import { MpProductsPage } from '../../support/pages/mp/products/mp-products-page';
import { MpOffersPage } from '../../support/pages/mp/offers/mp-offers-page';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user impersonation', (): void => {
  const backofficeSalesIndexPage: BackofficeSalesIndexPage = container.get(BackofficeSalesIndexPage);
  const backofficeSalesDetailPage: BackofficeSalesDetailPage = container.get(BackofficeSalesDetailPage);
  const mpSalesOrdersPage: MpSalesOrdersPage = container.get(MpSalesOrdersPage);
  const mpProfilePage: MpProfilePage = container.get(MpProfilePage);
  const mpProductsPage: MpProductsPage = container.get(MpProductsPage);
  const mpOffersPage: MpOffersPage = container.get(MpOffersPage);

  const backofficeLoginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  const placeGuestMpOrderScenario: PlaceGuestMpOrderScenario = container.get(PlaceGuestMpOrderScenario);
  const impersonateAsMerchantUserScenario: ImpersonateAsMerchantUserScenario = container.get(
    ImpersonateAsMerchantUserScenario
  );

  const cliHelper: CliHelper = container.get(CliHelper);

  let fixtures: MerchantUserImpersonationFixtures;

  before((): void => {
    fixtures = Cypress.env('fixtures');
  });

  it('agent should be able to change order status during impersonation', (): void => {
    cy.resetYvesCookies();
    const customerGuest: CustomerGuest = placeGuestMpOrderScenario.execute(fixtures.productConcreteSkus);
    cliHelper.run('console oms:check-condition');
    cliHelper.run('console oms:check-timeout');

    cy.resetBackofficeCookies();
    backofficeLoginUserScenario.execute(fixtures.backofficeUser);

    backofficeSalesIndexPage.viewLastPlacedOrder();
    backofficeSalesDetailPage.triggerOms('Pay');
    cliHelper.run('console oms:check-condition');
    cliHelper.run('console oms:check-timeout');
    backofficeSalesDetailPage.triggerOms('skip picking');

    cy.resetMerchantPortalCookies();
    impersonateAsMerchantUserScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);

    cy.visitMerchantPortal(mpSalesOrdersPage.PAGE_URL);
    mpSalesOrdersPage.cancelOrder(customerGuest.email);

    cy.visitMerchantPortal(mpSalesOrdersPage.PAGE_URL);
    mpSalesOrdersPage.findOrder(customerGuest.email).contains('canceled');
  });

  it('agent should be able to modify merchant profile information during impersonation', (): void => {
    cy.resetMerchantPortalCookies();
    impersonateAsMerchantUserScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);

    cy.visitMerchantPortal(mpProfilePage.PAGE_URL);
    mpProfilePage.updateMerchantPhoneNumber();

    cy.get('body').contains('The Profile has been changed successfully.');
  });

  it('agent should be able to modify product information during impersonation', (): void => {
    cy.resetMerchantPortalCookies();
    impersonateAsMerchantUserScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);

    cy.visitMerchantPortal(mpProductsPage.PAGE_URL);
    mpProductsPage.findProduct(fixtures.productAbstractSku).click();
    mpProductsPage.getDrawer().find('button:contains("Save")').click();

    cy.get('body').contains('The Product is saved.');
  });

  it('agent should be able to modify offer information during impersonation', (): void => {
    cy.resetMerchantPortalCookies();
    impersonateAsMerchantUserScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);

    cy.visitMerchantPortal(mpOffersPage.PAGE_URL);
    mpOffersPage.findOffer(fixtures.offerReference).click();
    mpOffersPage.getDrawer().find('button:contains("Save")').click();

    cy.get('body').contains('The Offer is saved.');
  });
});
