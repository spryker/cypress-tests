import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  addCartItem,
  blockAgenticCommerceClient,
  cancelQuoteApproval,
  cancelQuoteRequest,
  cancelWaitingQuoteApprovals,
  container,
  createQuoteRequest,
  deleteCart,
  exchangeAuthorizationCode,
  getCart,
  getQuoteApprovals,
  getQuoteApprovers,
  isAgenticCommerceCutReached,
  QuoteApprovalRequestAttributes,
  registerAgenticCommerceClient,
  requestQuoteApproval,
  sendQuoteRequestToUser,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import {
  AgenticCommerceClient,
  AgenticCommerceQuoteApprovalDynamicFixtures,
  AgenticCommerceQuoteApprovalStaticFixtures,
} from '@interfaces/api';

describe(
  'client-handles-quote-approval',
  { tags: ['@api', '@yves', '@agentic-commerce', '@agentic-commerce-cut-4b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('4b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 4b', () => {});
      return;
    }

    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);

    const QUOTE_APPROVAL_STATUS_WAITING = 'waiting';
    const QUOTE_REQUEST_STATUS_DRAFT = 'draft';
    // The status QuoteRequestsRestApi returns once a request is sent to the sales representative, taken from its
    // own storefront test (QuoteRequestActionsStorefrontApiIntegrationTest); confirm against US-45 once Task 5 fills it in.
    const QUOTE_REQUEST_STATUS_SENT_TO_USER = 'waiting';
    const CART_QUANTITY_AFTER_CREATION = 1;

    let staticFixtures: AgenticCommerceQuoteApprovalStaticFixtures;
    let dynamicFixtures: AgenticCommerceQuoteApprovalDynamicFixtures;
    let client: AgenticCommerceClient;
    let buyerAccessToken: string;
    let clientAccessToken: string;
    let approvalCartUuid: string;
    let quoteRequestCartUuid: string;
    let approverCompanyUserUuid: string;
    let quoteApprovalId: string;
    let quoteRequestReference: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then((token) => {
        buyerAccessToken = token;

        createCartWithItem(`Quote approval cart ${Date.now()}`).then((cartUuid) => {
          approvalCartUuid = cartUuid;
        });
        createCartWithItem(`Quote request cart ${Date.now()}`).then((cartUuid) => {
          quoteRequestCartUuid = cartUuid;
        });
      });

      registerAgenticCommerceClient(
        'ClientHandlesQuoteApproval',
        staticFixtures.redirectUri,
        staticFixtures.scope
      ).then((registeredClient) => {
        client = { ...registeredClient, scope: staticFixtures.scopeWithCart };
        setAgenticCommerceScopeCeiling(client, staticFixtures.scopeWithCart.split(' '));
        connectClient().then((accessToken) => {
          clientAccessToken = accessToken;
        });
      });
    });

    after((): void => {
      if (buyerAccessToken) {
        [approvalCartUuid, quoteRequestCartUuid]
          .filter((cartUuid) => cartUuid)
          .forEach((cartUuid) => {
            cancelWaitingQuoteApprovals(buyerAccessToken, cartUuid);
            deleteCart(buyerAccessToken, cartUuid);
          });

        if (quoteRequestReference) {
          cancelQuoteRequest(buyerAccessToken, quoteRequestReference);
        }
      }

      if (client) {
        blockAgenticCommerceClient(client);
      }
    });

    it('client should list the approvers of the cart, Arnold among them', (): void => {
      getQuoteApprovers(clientAccessToken, approvalCartUuid).then((response) => {
        expect(response.status).to.equal(200);

        const arnold = response.body.data.find(
          (approver) =>
            approver.attributes.firstName === staticFixtures.approver.firstName &&
            approver.attributes.lastName === staticFixtures.approver.lastName
        );

        expect(arnold, 'Arnold among the approvers').to.not.equal(undefined);
        expect(arnold?.attributes.companyUserUuid).to.be.a('string').and.not.be.empty;

        approverCompanyUserUuid = String(arnold?.attributes.companyUserUuid);
      });
    });

    it('client should send the cart to Arnold for approval, which locks the cart', (): void => {
      requestQuoteApproval(clientAccessToken, approvalCartUuid, buildQuoteApprovalAttributes()).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.data.attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
        expect(response.body.data.attributes.approverCompanyUserUuid).to.equal(approverCompanyUserUuid);

        quoteApprovalId = String(response.body.data.id);
      });

      expectCartLocked(approvalCartUuid);
    });

    it('client should be refused a second approval request for the same cart', (): void => {
      requestQuoteApproval(clientAccessToken, approvalCartUuid, buildQuoteApprovalAttributes()).then((response) => {
        expect(response.status).to.equal(422);
        expect(response.body.errors?.[0].code).to.equal(staticFixtures.approvalAlreadyRequestedErrorCode);
      });
    });

    it('client should read the one approval waiting and the cart approval status', (): void => {
      getQuoteApprovals(clientAccessToken, approvalCartUuid).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.length(1);
        expect(response.body.data[0].attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
        expect(response.body.meta?.cartApprovalStatus).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
      });
    });

    it('client should cancel the approval, which unlocks the cart', (): void => {
      cancelQuoteApproval(clientAccessToken, approvalCartUuid, quoteApprovalId).its('status').should('equal', 204);

      getQuoteApprovals(clientAccessToken, approvalCartUuid).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.meta?.cartApprovalStatus).to.equal(null);
      });

      expectCartUnlocked(approvalCartUuid);
    });

    it('client should turn a cart into a quote request and send it to the sales representative', (): void => {
      createQuoteRequest(clientAccessToken, quoteRequestCartUuid).then((createResponse) => {
        expect(createResponse.status).to.equal(201);
        expect(createResponse.body.data.attributes.status).to.equal(QUOTE_REQUEST_STATUS_DRAFT);

        quoteRequestReference = String(createResponse.body.data.id);

        sendQuoteRequestToUser(clientAccessToken, quoteRequestReference).then((sendResponse) => {
          expect(sendResponse.status).to.equal(201);
          expect(sendResponse.body.data.attributes.status).to.not.equal(QUOTE_REQUEST_STATUS_DRAFT);
          expect(sendResponse.body.data.attributes.status).to.equal(QUOTE_REQUEST_STATUS_SENT_TO_USER);
        });
      });
    });

    it('client with only cart:read should be refused the approval request and still read the approvers', (): void => {
      connectClient(staticFixtures.cartWriteScope).then((readOnlyAccessToken) => {
        requestQuoteApproval(readOnlyAccessToken, approvalCartUuid, buildQuoteApprovalAttributes()).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.headers['www-authenticate']).to.contain('Bearer');
          expect(response.headers['www-authenticate']).to.contain('error="insufficient_scope"');
          expect(response.headers['www-authenticate']).to.contain(`scope="${staticFixtures.cartWriteScope}"`);
        });

        expectCartUnlocked(approvalCartUuid);

        getQuoteApprovers(readOnlyAccessToken, approvalCartUuid).its('status').should('equal', 200);
      });
    });

    function connectClient(withoutScope?: string): Cypress.Chainable<string> {
      return clientAuthorizationScenario
        .execute({
          client,
          email: staticFixtures.buyerWithLimit.email,
          password: staticFixtures.defaultPassword,
          withoutScope,
        })
        .then(({ proofKey, response }) =>
          exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
            expect(tokenResponse.status).to.equal(200);

            return tokenResponse.body.access_token;
          })
        );
    }

    function createCartWithItem(name: string): Cypress.Chainable<string> {
      return cy
        .createCart(buyerAccessToken, {
          name,
          priceMode: staticFixtures.priceMode,
          currency: staticFixtures.currency,
          store: staticFixtures.store,
        })
        .then((cartUuid) => addCartItem(buyerAccessToken, cartUuid, buildCartItemBody()).then(() => cartUuid));
    }

    /**
     * Neither cart API exposes the lock, so the lock shows as a change that does not happen: the item quantity
     * stays as created.
     */
    function expectCartLocked(cartUuid: string): void {
      addCartItem(buyerAccessToken, cartUuid, buildCartItemBody(), false);

      getCart(buyerAccessToken, cartUuid).then((response) => {
        const quantity = (response.body.included ?? [])
          .filter((resource: { type: string }) => resource.type === 'items')
          .reduce(
            (sum: number, item: { attributes: { quantity: number } }) => sum + Number(item.attributes.quantity),
            0
          );

        expect(quantity).to.equal(CART_QUANTITY_AFTER_CREATION);
      });
    }

    function expectCartUnlocked(cartUuid: string): void {
      addCartItem(buyerAccessToken, cartUuid, buildCartItemBody(), false).its('status').should('equal', 201);
    }

    function buildCartItemBody(): Record<string, unknown> {
      return { data: { type: 'items', attributes: { sku: dynamicFixtures.product.sku, quantity: 1 } } };
    }

    function buildQuoteApprovalAttributes(): QuoteApprovalRequestAttributes {
      const address = { ...staticFixtures.address, isDefaultBilling: false, isDefaultShipping: false };

      return {
        approverCompanyUserUuid,
        billingAddress: address,
        shippingAddress: address,
        shipment: { idShipmentMethod: staticFixtures.idShipmentMethod },
        payments: [staticFixtures.payment],
      };
    }
  }
);
