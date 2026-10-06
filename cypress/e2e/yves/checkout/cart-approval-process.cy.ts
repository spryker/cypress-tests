import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartApprovalProcessDynamicFixtures, CartApprovalProcessStaticFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CompanyUserSelectPage,
  MultiCartPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  CustomerOverviewPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'cart approval process',
  { tags: ['@yves', '@checkout', 'checkout', 'cart', 'company-account', 'quote-approval', 'spryker-core'] },
  (): void => {
    // The approval process belongs to company accounts, which the B2C storefronts do not have.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C storefronts have no company accounts', () => {});

      return;
    }

    const cartPage = container.get(CartPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const multiCartPage = container.get(MultiCartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CartApprovalProcessStaticFixtures;
    let dynamicFixtures: CartApprovalProcessDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a cart above the buyer spend limit when the approver approves the request then the buyer can place the order', (): void => {
      // Arrange
      // The buyer's place-order permission is capped below the cart total, so the summary step
      // offers an approval request instead of letting the order through.
      loginAs(dynamicFixtures.buyer.email, dynamicFixtures.buyerCompanyUser.id_company_user);
      goToSummaryStep();

      // Act
      checkoutSummaryPage.requestApproval(dynamicFixtures.approverCompanyUser.id_company_user);

      // Assert
      checkoutSummaryPage.getApprovalStatus().should('contain', staticFixtures.waitingStatus);
      checkoutSummaryPage.getCancelApprovalRequestButton().should('exist');

      // Act
      // A cart waiting for approval is shared with the approver, but it is not their active cart:
      // it has to be picked out of the shared list first, or the approver checks out an empty one.
      loginAs(dynamicFixtures.approver.email, dynamicFixtures.approverCompanyUser.id_company_user);
      selectSeededCart();
      cartPage.visit();
      // The cart is locked while it waits, which is what the reset-lock form on it marks.
      cartPage.getLockedCartResetForm().should('exist');
      cartPage.approveCart();

      // Assert
      cartPage.getApprovalStatus().should('contain', staticFixtures.approvedStatus);

      // Act
      loginAs(dynamicFixtures.buyer.email, dynamicFixtures.buyerCompanyUser.id_company_user);
      selectSeededCart();
      cartPage.visit();
      cartPage.startCheckout();
      checkoutSummaryPage.placeOrder();

      // Assert
      cy.url({ timeout: 15000 }).should('not.include', '/checkout/summary');
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });

    function loginAs(email: string, idCompanyUser: number): void {
      // withoutSession, because this journey deliberately switches between two customers and a
      // restored session snapshot would carry the previous one's cart and permissions.
      customerLoginScenario.execute({
        email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });

      // Without an active company user the storefront has no company context, so no permission
      // limit applies and the approval widget is not rendered at all.
      companyUserSelectPage.visit();
      companyUserSelectPage.selectBusinessUnit({ idCompanyUser });
    }

    // Both customers accumulate carts across runs, and a cart waiting for approval is shared
    // rather than made active, so every leg has to pick this run's cart out of the list first.
    function selectSeededCart(): void {
      multiCartPage.visit();
      multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    }

    function goToSummaryStep(): void {
      selectSeededCart();
      cartPage.visit();
      cartPage.startCheckout();

      checkoutAddressPage.fillShippingAddress({ idCustomerAddress: dynamicFixtures.buyerAddress.id_customer_address });
      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setPaymentMethod(getPaymentMethodBasedOnEnv());
    }
  }
);
