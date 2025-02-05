import { container } from '@utils';
import { ClaimListPage, ClaimCreatePage, ClaimDetailPage, OrderDetailsPage, ClaimOrderPage } from '@pages/yves';
import { ClaimStaticFixtures, ClaimDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('claim management', { tags: ['@yves', '@claim'] }, (): void => {
  const claimListPage = container.get(ClaimListPage);
  const claimCreatePage = container.get(ClaimCreatePage);
  const claimDetailPage = container.get(ClaimDetailPage);
  const orderDetailPage = container.get(OrderDetailsPage);
  const claimOrderPage = container.get(ClaimOrderPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ClaimStaticFixtures;
  let dynamicFixtures: ClaimDynamicFixtures;

  before((): void => {

  });

    beforeEach((): void => {
        ({ staticFixtures, dynamicFixtures } = Cypress.env());
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });    });

  it('customer should be able to create a general claim', (): void => {
      claimListPage.visit();
      claimListPage.clickCreateClaimButton();

      staticFixtures.claim.availableTypes = staticFixtures.claimTypes.general;
      claimCreatePage.assertPageLocation();
      claimCreatePage.createClaim(staticFixtures.claim);

      claimDetailPage.assertPageLocation();
      cy.contains(claimCreatePage.getClaimCreatedMessage()).should('exist');
  });

    it('customer should be able to create an order claim', (): void => {
        orderDetailPage.visit({
            qs: {
                id: dynamicFixtures.order.id_sales_order
            }
        });
        claimOrderPage.clickCreateClaimButton();

        claimCreatePage.assertPageLocation();
        staticFixtures.claim.availableTypes = staticFixtures.claimTypes.order;
        claimCreatePage.createOrderClaim({...staticFixtures.claim, orderReference: dynamicFixtures.order.order_reference});

        claimDetailPage.assertPageLocation();
        cy.contains(claimCreatePage.getClaimCreatedMessage()).should('exist');
    });
});
