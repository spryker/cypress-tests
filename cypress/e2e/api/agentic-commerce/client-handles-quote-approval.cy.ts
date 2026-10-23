import {
  addCartItem,
  cancelQuoteApproval,
  cancelQuoteRequest,
  cancelWaitingQuoteApprovals,
  createQuoteRequest,
  deleteCart,
  getCart,
  getQuoteApprovals,
  getQuoteApprovers,
  isAgenticCommerceCutReached,
  QuoteApprovalRequestAttributes,
  requestQuoteApproval,
  sendQuoteRequestToUser,
} from '@utils';
import {
  AgenticCommerceQuoteApprovalDynamicFixtures,
  AgenticCommerceQuoteApprovalStaticFixtures,
} from '@interfaces/api';

/**
 * A delegated token reaches only the feature's protected resource, so these storefront resources run here with the
 * buyer's own storefront token; the delegated path is covered in Codeception through the contract probe.
 */
describe(
  'client-handles-quote-approval',
  { tags: ['@api', '@agentic-commerce', '@agentic-commerce-cut-4b', 'agentic-commerce'] },
  (): void => {
    if (!isAgenticCommerceCutReached('4b')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 4b', () => {});
      return;
    }

    const QUOTE_APPROVAL_STATUS_WAITING = 'waiting';
    const QUOTE_REQUEST_STATUS_DRAFT = 'draft';
    const QUOTE_REQUEST_STATUS_WAITING = 'waiting';
    const CART_QUANTITY_AFTER_CREATION = 1;

    let staticFixtures: AgenticCommerceQuoteApprovalStaticFixtures;
    let dynamicFixtures: AgenticCommerceQuoteApprovalDynamicFixtures;
    let buyerAccessToken: string;
    let approvalCartUuid: string;
    let quoteRequestCartUuid: string;
    let approverCompanyUserUuid: string;
    let quoteApprovalId: string;
    let quoteRequestReference: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.getCustomerAccessToken(staticFixtures.buyerWithLimit.email, staticFixtures.defaultPassword).then((token) => {
        buyerAccessToken = token;

        createCartWithItem(`Quote approval cart ${Date.now()}`, (cartUuid) => {
          approvalCartUuid = cartUuid;
        });
        createCartWithItem(`Quote request cart ${Date.now()}`, (cartUuid) => {
          quoteRequestCartUuid = cartUuid;
        });
      });
    });

    after((): void => {
      if (!buyerAccessToken) {
        return;
      }

      if (quoteRequestReference) {
        cancelQuoteRequest(buyerAccessToken, quoteRequestReference);
      }

      [approvalCartUuid, quoteRequestCartUuid]
        .filter((cartUuid) => cartUuid)
        .forEach((cartUuid) => {
          cancelWaitingQuoteApprovals(buyerAccessToken, cartUuid);
          deleteCart(buyerAccessToken, cartUuid);
        });
    });

    it('buyer should list the approvers of the cart, Arnold among them', (): void => {
      getQuoteApprovers(buyerAccessToken, approvalCartUuid).then((response) => {
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

    it('buyer should send the cart to Arnold for approval, which locks the cart', (): void => {
      requestQuoteApproval(buyerAccessToken, approvalCartUuid, buildQuoteApprovalAttributes()).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.data.attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
        expect(response.body.data.attributes.approverCompanyUserUuid).to.equal(approverCompanyUserUuid);

        quoteApprovalId = String(response.body.data.id);
      });

      expectCartLocked(approvalCartUuid);
    });

    it('buyer should be refused a second approval request for the same cart', (): void => {
      requestQuoteApproval(buyerAccessToken, approvalCartUuid, buildQuoteApprovalAttributes()).then((response) => {
        expect(response.status).to.equal(422);
        expect(response.body.errors?.[0].code).to.equal(staticFixtures.approvalAlreadyRequestedErrorCode);
      });
    });

    it('buyer should read the one approval waiting and the cart approval status', (): void => {
      getQuoteApprovals(buyerAccessToken, approvalCartUuid).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data).to.have.length(1);
        expect(response.body.data[0].attributes.status).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
        expect(response.body.meta?.cartApprovalStatus).to.equal(QUOTE_APPROVAL_STATUS_WAITING);
      });
    });

    it('buyer should cancel the approval, which unlocks the cart', (): void => {
      cancelQuoteApproval(buyerAccessToken, approvalCartUuid, quoteApprovalId).its('status').should('equal', 204);

      getQuoteApprovals(buyerAccessToken, approvalCartUuid).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.meta?.cartApprovalStatus).to.equal(null);
      });

      addCartItem(buyerAccessToken, approvalCartUuid, buildCartItemBody(), false).its('status').should('equal', 201);
    });

    it('buyer should turn a cart into a quote request and send it to the sales representative', (): void => {
      createQuoteRequest(buyerAccessToken, quoteRequestCartUuid).then((createResponse) => {
        expect(createResponse.status).to.equal(201);
        expect(createResponse.body.data.attributes.status).to.equal(QUOTE_REQUEST_STATUS_DRAFT);

        quoteRequestReference = String(createResponse.body.data.id);

        sendQuoteRequestToUser(buyerAccessToken, quoteRequestReference).then((sendResponse) => {
          expect(sendResponse.status).to.equal(201);
          expect(sendResponse.body.data.attributes.status).to.equal(QUOTE_REQUEST_STATUS_WAITING);
        });
      });
    });

    /**
     * The id is handed over as soon as the cart exists, so the `after` hook deletes it even when adding the item fails.
     */
    function createCartWithItem(name: string, onCreated: (cartUuid: string) => void): void {
      cy.createCart(buyerAccessToken, {
        name,
        priceMode: staticFixtures.priceMode,
        currency: staticFixtures.currency,
        store: staticFixtures.store,
      }).then((cartUuid) => {
        onCreated(cartUuid);
        addCartItem(buyerAccessToken, cartUuid, buildCartItemBody());
      });
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
