import { MarketplaceAgentAssistStaticFixtures, MarketplaceAgentAssistSuite2DynamicFixtures } from '@interfaces/mp';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { OffersPage, ProductsPage, ProfilePage, SalesOrdersPage } from '@pages/mp';
import { CartPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ImpersonateAsMerchantUserScenario } from '@scenarios/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('marketplace agent assist suite 2', { tags: ['@marketplace-agent-assist'] }, (): void => {
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

  let dynamicFixtures: MarketplaceAgentAssistSuite2DynamicFixtures;
  let staticFixtures: MarketplaceAgentAssistStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to change order status during impersonation', (): void => {
    customerLoginScenario.execute({ email: dynamicFixtures.customer.email, password: staticFixtures.defaultPassword });

    cartPage.visit();
    cartPage.quickAddToCart(dynamicFixtures.productConcreteForOffer.sku);
    checkoutMpScenario.execute({ isGuest: false });

    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('skip picking', true);

    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    salesOrdersPage.visit();
    salesOrdersPage.cancelOrder(dynamicFixtures.customer.email);

    // Ensure that order was canceled
    salesOrdersPage.visit();
    salesOrdersPage.findOrder(dynamicFixtures.customer.email).contains('canceled');
  });

  it('agent should be able to modify merchant profile information during impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    profilePage.visit();
    profilePage.updateMerchantPhoneNumber();

    cy.get('body').contains('The Profile has been changed successfully.');
  });

  it('agent should be able to modify product information during impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    productsPage.visit();
    productsPage.findProduct(dynamicFixtures.productConcreteForMerchant.abstract_sku).click();
    productsPage.getDrawer().find('button:contains("Save")').click();

    cy.get('body').contains('The Product is saved.');
  });

  it('agent should be able to modify offer information during impersonation', (): void => {
    impersonateScenario.execute(
      dynamicFixtures.merchantAgentUser.username,
      staticFixtures.defaultPassword,
      dynamicFixtures.merchantUser.username
    );

    offersPage.visit();
    offersPage.findOffer(dynamicFixtures.productOffer.product_offer_reference).click();
    offersPage.getDrawer().find('button:contains("Save")').click();

    cy.get('body').contains('The Offer is saved.');
  });
});
