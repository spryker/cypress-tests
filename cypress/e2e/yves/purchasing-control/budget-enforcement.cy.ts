import { container } from '@utils';
import { BudgetEnforcementStaticFixtures, BudgetEnforcementDynamicFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  CheckoutSummaryBudgetPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'purchasing control budget enforcement at checkout',
  { tags: ['@yves', '@purchasing-control', 'purchasing-control', 'spryker-core'] },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, and b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const cartPage = container.get(CartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const checkoutSummaryBudgetPage = container.get(CheckoutSummaryBudgetPage);

    let staticFixtures: BudgetEnforcementStaticFixtures;
    let dynamicFixtures: BudgetEnforcementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    const loginAsCompanyBuyer = (email: string): void => {
      customerLoginScenario.execute({ email, password: staticFixtures.defaultPassword, withoutSession: true });
    };

    const proceedThroughCheckoutToSummary = (email: string): void => {
      loginAsCompanyBuyer(email);
      cartPage.visit();
      cartPage.startCheckout();
      checkoutAddressPage.fillShippingAddress();
      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setDummyPaymentMethod();
    };

    it('buyer should be able to place order when grand total is within budget', (): void => {
      proceedThroughCheckoutToSummary(dynamicFixtures.buyerForWithin.email);
      checkoutSummaryPage.placeOrder();

      cy.url().should('include', '/checkout/success');
    });

    it('buyer should be blocked from placing order when block budget is exceeded', (): void => {
      proceedThroughCheckoutToSummary(dynamicFixtures.buyerForBlock.email);

      checkoutSummaryBudgetPage.assertEnforcementError();
      cy.url().should('include', '/checkout/summary');
    });

    it('buyer should see warning but still place order when warn budget is exceeded', (): void => {
      proceedThroughCheckoutToSummary(dynamicFixtures.buyerForWarn.email);
      checkoutSummaryPage.placeOrder();

      cy.url().should('include', '/checkout/success');
      checkoutSummaryBudgetPage.assertWarnFlashMessage();
    });

    it('buyer should be blocked from placing order when require_approval budget is exceeded without approval', (): void => {
      proceedThroughCheckoutToSummary(dynamicFixtures.buyerForRequireApproval.email);

      checkoutSummaryBudgetPage.assertEnforcementError();
      cy.url().should('include', '/checkout/summary');
    });
  }
);
