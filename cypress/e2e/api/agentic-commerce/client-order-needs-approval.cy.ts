import { MultiCartPage, QuoteApprovalPage } from '@pages/yves';
import { CheckoutScenario, ClientAuthorizationScenario, CustomerLoginScenario } from '@scenarios/yves';
import {
  addCartItem,
  blockAgenticCommerceClient,
  cancelWaitingQuoteApprovals,
  container,
  deleteCart,
  exchangeAuthorizationCode,
  getQuoteApprovals,
  getQuoteApprovers,
  isAgenticCommerceCutReached,
  registerAgenticCommerceClient,
  requestQuoteApproval,
  setAgenticCommerceScopeCeiling,
  submitCheckout,
} from '@utils';
import {
  AgenticCommerceClient,
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
    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);

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

        createCartWithItem(accessToken, CART_NAME).then((id) => {
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

        const CLIENT_CART_NAME = `Client approval cart ${Date.now()}`;
        const QUOTE_APPROVAL_STATUS_WAITING = 'waiting';
        const QUOTE_APPROVAL_STATUS_APPROVED = 'approved';

        let client: AgenticCommerceClient;
        let clientAccessToken: string;
        let clientCartId: string;
        let buyerAccessToken: string;

        before((): void => {
          ({ staticFixtures, dynamicFixtures } = Cypress.env());

          cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then(
            (token) => {
              buyerAccessToken = token;

              createCartWithItem(buyerAccessToken, CLIENT_CART_NAME).then((id) => {
                clientCartId = id;
              });
            }
          );

          registerAgenticCommerceClient(
            'ClientOrderNeedsApproval',
            staticFixtures.redirectUri,
            staticFixtures.scope
          ).then((registeredClient) => {
            client = { ...registeredClient, scope: staticFixtures.scopeWithCart };
            setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithCart.split(' '));

            clientAuthorizationScenario
              .execute({
                client,
                email: staticFixtures.buyerWithLimit.email,
                password: staticFixtures.defaultPassword,
              })
              .then(({ proofKey, response }) => {
                exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
                  expect(tokenResponse.status).to.equal(200);
                  clientAccessToken = tokenResponse.body.access_token;
                });
              });
          });
        });

        after((): void => {
          if (buyerAccessToken && clientCartId) {
            cancelWaitingQuoteApprovals(buyerAccessToken, clientCartId);
            deleteCart(buyerAccessToken, clientCartId);
          }

          if (client) {
            blockAgenticCommerceClient(client);
          }
        });

        it('client should send the cart to Arnold through the quote approvals resource', (): void => {
          getQuoteApprovers(clientAccessToken, clientCartId).then((approversResponse) => {
            expect(approversResponse.status).to.equal(200);

            const arnold = approversResponse.body.data.find(
              (approver) =>
                approver.attributes.firstName === staticFixtures.approver.firstName &&
                approver.attributes.lastName === staticFixtures.approver.lastName
            );

            expect(arnold, 'Arnold among the approvers').to.not.equal(undefined);

            requestQuoteApproval(clientAccessToken, clientCartId, {
              approverCompanyUserUuid: String(arnold?.attributes.companyUserUuid),
              billingAddress: buildAddressPayload(),
              shippingAddress: buildAddressPayload(),
              shipment: { idShipmentMethod: staticFixtures.idShipmentMethod },
              payments: [staticFixtures.payment],
            }).then((response) => {
              expect(response.status).to.equal(201);
              expect(response.body.data.attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
            });
          });
        });

        it('approver should approve the cart the client sent for approval', (): void => {
          approveAsApprover(CLIENT_CART_NAME);
        });

        it('client should read the approved status and the buyer should check out the cart', (): void => {
          getQuoteApprovals(clientAccessToken, clientCartId).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.meta?.cartApprovalStatus).to.equal(QUOTE_APPROVAL_STATUS_APPROVED);
          });

          submitCheckout(buyerAccessToken, buildCheckoutPayload(clientCartId), false)
            .its('status')
            .should('equal', 201);
        });
      }
    );

    function createCartWithItem(buyerToken: string, name: string): Cypress.Chainable<string> {
      return cy
        .createCart(buyerToken, {
          name,
          priceMode: staticFixtures.priceMode,
          currency: staticFixtures.currency,
          store: staticFixtures.store,
        })
        .then((id) =>
          addCartItem(buyerToken, id, {
            data: { type: 'items', attributes: { sku: dynamicFixtures.product.sku, quantity: 1 } },
          }).then(() => id)
        );
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
