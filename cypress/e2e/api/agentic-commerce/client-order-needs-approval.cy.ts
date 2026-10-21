import { MultiCartPage, QuoteApprovalPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { addCartItem, container, getCompanyUserAccessToken, isAgenticCommerceCutReached, submitCheckout } from '@utils';
import {
  AgenticCommerceOrderApprovalDynamicFixtures,
  AgenticCommerceOrderApprovalStaticFixtures,
} from '@interfaces/api';
import { retryableBefore } from '../../../support/e2e';

describe(
  'client-order-needs-approval',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-4', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('4')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 4', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const multiCartPage = container.get(MultiCartPage);
    const quoteApprovalPage = container.get(QuoteApprovalPage);

    const CART_NAME = `Approval cart ${Date.now()}`;

    let staticFixtures: AgenticCommerceOrderApprovalStaticFixtures;
    let dynamicFixtures: AgenticCommerceOrderApprovalDynamicFixtures;
    let accessToken: string;
    let cartId: string;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      getCompanyUserAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then((token) => {
        accessToken = token;

        cy.createCart(accessToken, {
          name: CART_NAME,
          priceMode: staticFixtures.priceMode,
          currency: staticFixtures.currency,
          store: staticFixtures.store,
        }).then((id) => {
          cartId = id;

          addCartItem(accessToken, cartId, {
            data: { type: 'items', attributes: { sku: dynamicFixtures.product.sku, quantity: 1 } },
          });
        });
      });
    });

    it('buyer should be refused the checkout of a cart above the role limit', (): void => {
      submitCheckout(accessToken, buildCheckoutPayload(), false).then((response) => {
        expect(response.status).to.equal(422);
        expect(JSON.stringify(response.body)).to.contain(staticFixtures.requireApprovalMessage);
      });
    });

    it('approver should approve the cart the buyer sent for approval', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.buyerWithLimit.email,
        password: staticFixtures.defaultPassword,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: CART_NAME });
      quoteApprovalPage.sendForApproval(staticFixtures.approver.fullName);

      customerLoginScenario.execute({
        email: staticFixtures.approver.email,
        password: staticFixtures.defaultPassword,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: CART_NAME });
      quoteApprovalPage.approve();
    });

    it('buyer should check out the approved cart', (): void => {
      submitCheckout(accessToken, buildCheckoutPayload(), false).its('status').should('equal', 201);
    });

    function buildCheckoutPayload(): Record<string, unknown> {
      const addressPayload = { ...staticFixtures.address, isDefaultBilling: false, isDefaultShipping: false };

      return {
        data: {
          type: 'checkout',
          attributes: {
            customer: {
              email: staticFixtures.buyerWithLimit.email,
              salutation: staticFixtures.address.salutation,
              firstName: staticFixtures.address.firstName,
              lastName: staticFixtures.address.lastName,
            },
            idCart: cartId,
            billingAddress: addressPayload,
            shippingAddress: addressPayload,
            payments: [staticFixtures.payment],
            shipment: { idShipmentMethod: staticFixtures.idShipmentMethod },
            items: [dynamicFixtures.product.sku],
          },
        },
      };
    }
  }
);
