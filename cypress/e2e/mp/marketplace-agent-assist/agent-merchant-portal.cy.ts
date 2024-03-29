import { container } from '@utils';
import { AgentMerchantPortalDynamicFixtures, MarketplaceAgentAssistStaticFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { OffersPage, ProductsPage, ProfilePage, SalesOrdersPage } from '@pages/mp';
import { CartPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ImpersonateAsMerchantUserScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('agent merchant portal', { tags: ['@marketplace-agent-assist'] }, (): void => {
  const cartPage = container.get(CartPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const salesOrdersPage = container.get(SalesOrdersPage);
  const profilePage = container.get(ProfilePage);
  const productsPage = container.get(ProductsPage);
  const offersPage = container.get(OffersPage);
  const userLoginScenario = container.get(UserLoginScenario);
  const impersonateScenario = container.get(ImpersonateAsMerchantUserScenario);
  const customerLoginScenario = container.get(CustomerLoginScenario);
  const checkoutMpScenario = container.get(CheckoutMpScenario);

  let dynamicFixtures: AgentMerchantPortalDynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to change order status during impersonation', (): void => {
    customerLoginScenario.execute({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });

    cartPage.visit();
    cartPage.quickAddToCart({ sku: dynamicFixtures.productConcreteForOffer.sku, quantity: 1 });
    checkoutMpScenario.execute({ isGuest: false });

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.visit();
    salesIndexPage.view();
    salesDetailPage.triggerOms({ state: 'Pay' });
    salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

    impersonateScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
      query: dynamicFixtures.merchantUser.username,
    });

    salesOrdersPage.visit();
    salesOrdersPage.cancel({ query: dynamicFixtures.customer.email });

    // Ensure that order was canceled
    salesOrdersPage.visit();
    salesOrdersPage.find({ query: dynamicFixtures.customer.email }).contains('canceled');
  });

  it('agent should be able to modify merchant profile information during impersonation', (): void => {
    impersonateScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
      query: dynamicFixtures.merchantUser.username,
    });

    profilePage.visit();
    profilePage.updatePhone();

    cy.get('body').contains('The Profile has been changed successfully.');
  });

  it('agent should be able to modify product information during impersonation', (): void => {
    impersonateScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
      query: dynamicFixtures.merchantUser.username,
    });

    productsPage.visit();
    productsPage.find({ query: dynamicFixtures.productConcreteForMerchant.abstract_sku }).click({ force: true });
    productsPage.getDrawer().find(productsPage.getSaveButtonSelector()).click();

    cy.get('body').contains('The Product is saved.');
  });

  it('agent should be able to modify offer information during impersonation', (): void => {
    impersonateScenario.execute({
      username: dynamicFixtures.merchantAgentUser.username,
      password: staticFixtures.defaultPassword,
      query: dynamicFixtures.merchantUser.username,
    });

    offersPage.visit();
    offersPage.find({ query: dynamicFixtures.productOffer.product_offer_reference }).click({ force: true });
    offersPage.getDrawer().find(offersPage.getSaveButtonSelector()).click();

    cy.get('body').contains('The Offer is saved.');
  });
});
