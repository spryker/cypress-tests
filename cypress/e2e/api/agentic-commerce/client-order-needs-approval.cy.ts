import { MultiCartPage, QuoteApprovalPage } from '@pages/yves';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import {
  addCartItem,
  cancelWaitingQuoteApprovals,
  container,
  deleteCart,
  getQuoteApprovals,
  getQuoteApprovers,
  isAgenticCommerceCutReached,
  requestOnce,
  requestQuoteApproval,
  StorefrontItemBody,
  submitCheckout,
} from '@utils';
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
    const checkoutScenario = container.get(CheckoutScenario);
    const quoteApprovalPage = container.get(QuoteApprovalPage);

    const CART_NAME = `Approval cart ${Date.now()}`;

    let staticFixtures: AgenticCommerceOrderApprovalStaticFixtures;
    let dynamicFixtures: AgenticCommerceOrderApprovalDynamicFixtures;
    let accessToken: string;
    let cartId: string;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then((token) => {
        accessToken = token;

        if (cartId) {
          return;
        }

        createCartWithItem(accessToken, CART_NAME, (id) => {
          cartId = id;
        });
      });
    });

    after((): void => {
      if (cartId) {
        deleteCart(accessToken, cartId);
      }
    });

    it('buyer should be refused the checkout of a cart above the role limit', (): void => {
      submitCheckout(accessToken, buildCheckoutPayload(cartId), false).then((response) => {
        expect(response.status).to.equal(422);
        expect(response.body.errors[0].code).to.equal(staticFixtures.requireApprovalErrorCode);
        expect(response.body.errors[0].detail).to.equal(staticFixtures.requireApprovalMessage);
      });
    });

    it('approver should approve the cart the buyer sent for approval', (): void => {
      customerLoginScenario.execute({
        email: staticFixtures.buyerWithLimit.email,
        password: staticFixtures.defaultPassword,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: CART_NAME });
      checkoutScenario.execute({ shouldSkipPlaceOrder: true });
      quoteApprovalPage.sendForApproval(staticFixtures.approver.fullName);

      approveAsApprover(CART_NAME);
    });

    it('buyer should check out the approved cart', (): void => {
      submitCheckout(accessToken, buildCheckoutPayload(cartId), false).its('status').should('equal', 201);
    });

    describe(
      'client-order-needs-approval through the quote approvals resource',
      { tags: ['@agentic-commerce-cut-4b'] },
      (): void => {
        if (!isAgenticCommerceCutReached('4b')) {
          it.skip('skipped until the suite runs AgenticCommerce cut 4b', () => {});
          return;
        }

        const RESOURCE_CART_NAME = `Resource cart ${Date.now()}`;
        const QUOTE_APPROVAL_STATUS_WAITING = 'waiting';
        const QUOTE_APPROVAL_STATUS_APPROVED = 'approved';

        let buyerAccessToken: string;
        let resourceCartId: string;
        let approvalResponse: Cypress.Response<StorefrontItemBody> | undefined;

        before((): void => {
          ({ staticFixtures, dynamicFixtures } = Cypress.env());

          cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then(
            (token) => {
              buyerAccessToken = token;

              createCartWithItem(buyerAccessToken, RESOURCE_CART_NAME, (id) => {
                resourceCartId = id;
              });
            }
          );
        });

        after((): void => {
          if (buyerAccessToken && resourceCartId) {
            cancelWaitingQuoteApprovals(buyerAccessToken, resourceCartId);
            deleteCart(buyerAccessToken, resourceCartId);
          }
        });

        it('buyer should send the cart to Arnold through the quote approvals resource', (): void => {
          getQuoteApprovers(buyerAccessToken, resourceCartId).then((approversResponse) => {
            expect(approversResponse.status).to.equal(200);

            const arnold = approversResponse.body.data.find(
              (approver) =>
                approver.attributes.firstName === staticFixtures.approver.firstName &&
                approver.attributes.lastName === staticFixtures.approver.lastName
            );

            expect(arnold, 'Arnold among the approvers').to.not.equal(undefined);

            requestOnce(approvalResponse, () =>
              requestQuoteApproval(buyerAccessToken, resourceCartId, {
                approverCompanyUserUuid: String(arnold?.attributes.companyUserUuid),
                billingAddress: buildAddressPayload(),
                shippingAddress: buildAddressPayload(),
                shipment: { idShipmentMethod: staticFixtures.idShipmentMethod },
                payments: [staticFixtures.payment],
              })
            ).then((response) => {
              approvalResponse = response;

              expect(response.status).to.equal(201);
              expect(response.body.data.attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
            });
          });
        });

        it('approver should approve the cart the buyer sent through the resource', (): void => {
          approveAsApprover(RESOURCE_CART_NAME);
        });

        it('buyer should read the approved status and check out the cart', (): void => {
          getQuoteApprovals(buyerAccessToken, resourceCartId).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.meta?.cartApprovalStatus).to.equal(QUOTE_APPROVAL_STATUS_APPROVED);
          });

          submitCheckout(buyerAccessToken, buildCheckoutPayload(resourceCartId), false)
            .its('status')
            .should('equal', 201);
        });
      }
    );

    /**
     * The id is handed over as soon as the cart exists, so the `after` hook deletes it even when adding the item fails.
     */
    function createCartWithItem(buyerToken: string, name: string, onCreated: (id: string) => void): void {
      cy.createCart(buyerToken, {
        name,
        priceMode: staticFixtures.priceMode,
        currency: staticFixtures.currency,
        store: staticFixtures.store,
      }).then((id) => {
        onCreated(id);
        addCartItem(buyerToken, id, {
          data: { type: 'items', attributes: { sku: dynamicFixtures.product.sku, quantity: 1 } },
        });
      });
    }

    function approveAsApprover(cartName: string): void {
      customerLoginScenario.execute({
        email: staticFixtures.approver.email,
        password: staticFixtures.defaultPassword,
      });
      multiCartPage.visit();
      multiCartPage.selectCart({ name: cartName });
      quoteApprovalPage.approve();

      quoteApprovalPage.getApprovalStatus().should('contain', staticFixtures.approvedLabel);
    }

    function buildAddressPayload(): Record<string, unknown> {
      return { ...staticFixtures.address, isDefaultBilling: false, isDefaultShipping: false };
    }

    function buildCheckoutPayload(idCart: string): Record<string, unknown> {
      const addressPayload = buildAddressPayload();

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
            idCart,
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
