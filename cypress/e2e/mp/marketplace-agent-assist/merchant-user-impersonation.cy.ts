
/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user impersonation', (): void => {
  // const salesIndexPage: BackofficeSalesIndexPage = container.get(BackofficeSalesIndexPage);
  // const salesDetailPage: BackofficeSalesDetailPage = container.get(BackofficeSalesDetailPage);
  // const mpSalesOrdersPage: MpSalesOrdersPage = container.get(MpSalesOrdersPage);
  // const mpProfilePage: MpProfilePage = container.get(MpProfilePage);
  // const mpProductsPage: MpProductsPage = container.get(MpProductsPage);
  // const mpOffersPage: MpOffersPage = container.get(MpOffersPage);
  //
  // const loginUserScenario: BackofficeLoginUserScenario = container.get(BackofficeLoginUserScenario);
  // const impersonateScenario: ImpersonateAsMerchantUserScenario = container.get(ImpersonateAsMerchantUserScenario);
  // const placeGuestMpOrderScenario: PlaceGuestMpOrderScenario = container.get(PlaceGuestMpOrderScenario);
  //
  // let fixtures: MerchantUserImpersonationFixtures;
  //
  // before((): void => {
  //   fixtures = Cypress.env('fixtures');
  // });
  //
  // it('agent should be able to change order status during impersonation', (): void => {
  //   cy.resetYvesCookies();
  //   const guest: Guest = placeGuestMpOrderScenario.execute(fixtures.productConcreteSkus);
  //
  //   cy.resetBackofficeCookies();
  //   loginUserScenario.execute(fixtures.backofficeUser);
  //
  //   salesIndexPage.viewLastPlacedOrder();
  //   salesDetailPage.triggerOms('Pay');
  //   salesDetailPage.triggerOms('skip picking', true);
  //
  //   cy.resetMerchantPortalCookies();
  //   impersonateScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);
  //
  //   cy.visitMerchantPortal(mpSalesOrdersPage.PAGE_URL);
  //   mpSalesOrdersPage.cancelOrder(guest.email);
  //
  //   // Ensure that order was canceled
  //   cy.visitMerchantPortal(mpSalesOrdersPage.PAGE_URL);
  //   mpSalesOrdersPage.findOrder(guest.email).contains('canceled');
  // });
  //
  // it('agent should be able to modify merchant profile information during impersonation', (): void => {
  //   cy.resetMerchantPortalCookies();
  //   impersonateScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);
  //
  //   cy.visitMerchantPortal(mpProfilePage.PAGE_URL);
  //   mpProfilePage.updateMerchantPhoneNumber();
  //
  //   cy.get('body').contains('The Profile has been changed successfully.');
  // });
  //
  // it('agent should be able to modify product information during impersonation', (): void => {
  //   cy.resetMerchantPortalCookies();
  //   impersonateScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);
  //
  //   cy.visitMerchantPortal(mpProductsPage.PAGE_URL);
  //   mpProductsPage.findProduct(fixtures.productAbstractSku).click();
  //   mpProductsPage.getDrawer().find('button:contains("Save")').click();
  //
  //   cy.get('body').contains('The Product is saved.');
  // });
  //
  // it('agent should be able to modify offer information during impersonation', (): void => {
  //   cy.resetMerchantPortalCookies();
  //   impersonateScenario.execute(fixtures.merchantAgentUser, fixtures.merchantUsername);
  //
  //   cy.visitMerchantPortal(mpOffersPage.PAGE_URL);
  //   mpOffersPage.findOffer(fixtures.offerReference).click();
  //   mpOffersPage.getDrawer().find('button:contains("Save")').click();
  //
  //   cy.get('body').contains('The Offer is saved.');
  // });
});