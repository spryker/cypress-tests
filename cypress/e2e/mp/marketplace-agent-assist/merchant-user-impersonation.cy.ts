import { container } from '../../../support/utils/inversify/inversify.config';
import { OffersPage, ProductsPage, ProfilePage, SalesOrdersPage } from '../../../support/pages/mp';
import { SalesDetailPage, SalesIndexPage } from '../../../support/pages/backoffice';
import { UserLoginScenario } from '../../../support/scenarios/backoffice';
import { ImpersonateAsMerchantUserScenario } from '../../../support/scenarios/mp';
import {
  MerchantUserImpersonationDynamicFixtures,
  MerchantUserImpersonationStaticFixtures,
} from '../../../support/types/mp/merchant-user-impersonation';
import { CustomerLoginScenario, PlaceMpOrderScenario } from '../../../support/scenarios/yves';

/**
 * Agent Assist in Merchant Portal checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/3975741526/Agent+Assist+in+Merchant+Portal+Checklists}
 */
describe('merchant user impersonation', (): void => {
  const salesIndexPage: SalesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage: SalesDetailPage = container.get(SalesDetailPage);
  const salesOrdersPage: SalesOrdersPage = container.get(SalesOrdersPage);
  const profilePage: ProfilePage = container.get(ProfilePage);
  const productsPage: ProductsPage = container.get(ProductsPage);
  const offersPage: OffersPage = container.get(OffersPage);

  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);
  const impersonateScenario: ImpersonateAsMerchantUserScenario = container.get(ImpersonateAsMerchantUserScenario);
  const customerLoginScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);
  const placeMpOrderScenario: PlaceMpOrderScenario = container.get(PlaceMpOrderScenario);

  let dynamicFixtures: MerchantUserImpersonationDynamicFixtures;
  let staticFixtures: MerchantUserImpersonationStaticFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  it('agent should be able to change order status during impersonation', (): void => {
    customerLoginScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);
    placeMpOrderScenario.execute(dynamicFixtures.productConcreteForOffer.sku);

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

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
