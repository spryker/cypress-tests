import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { MinimumOrderValueDynamicFixtures, MinimumOrderValueStaticFixtures } from '@interfaces/yves';
import { CartPage, CheckoutSummaryPage, CustomerOverviewPage } from '@pages/yves';
import { GlobalThresholdPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

const STORE_CURRENCY = 'DE - Euro [EUR]';
const SOFT_STRATEGY_FIXED_FEE = 'Soft Threshold with fixed fee';

// The fixture prices the single product at 300.00, so the thresholds can be stated as absolute
// amounts without depending on a demo-data price point: two of it sit above the maximum, one sits
// below, and both sit below the soft threshold that adds the fee.
//
// The cart crosses the maximum by quantity rather than by removing a second line, because the
// quote is seeded once per spec and a Cypress retry re-runs the test against whatever the previous
// attempt left behind. Setting an absolute quantity is the same operation whatever that was.
const QUANTITY_ABOVE_MAXIMUM = 2;
const QUANTITY_BELOW_MAXIMUM = 1;
const MAXIMUM_VALUE = '350';
const MINIMUM_VALUE = '5';
const SOFT_VALUE = '1000';
const SOFT_FIXED_FEE = '9';
const EXPECTED_SURCHARGE = '€9.00';
const EXPECTED_MAXIMUM_MESSAGE = 'Order value is above the maximum of €350.00';

const THRESHOLD_MESSAGES = {
  minimum: 'Order value is below the minimum of {{threshold}}',
  maximum: 'Order value is above the maximum of {{threshold}}',
  soft: 'A fixed fee of {{fee}} applies below {{threshold}}',
};

describe(
  'minimum order value',
  { tags: ['@yves', '@checkout', 'order-threshold', 'cart', 'checkout', 'spryker-core'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const globalThresholdPage = container.get(GlobalThresholdPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MinimumOrderValueStaticFixtures;
    let dynamicFixtures: MinimumOrderValueDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    // The thresholds are global state for the whole store, so they are put back where they were
    // found. A maximum left at 350.00 would block every other checkout in the environment.
    after((): void => {
      loginAsBackofficeUser();
      globalThresholdPage.applyThresholds({
        storeCurrency: STORE_CURRENCY,
        minimumValue: '',
        maximumValue: '10000',
        softStrategy: 'None',
        softValue: '',
        softFixedFee: '',
      });
    });

    it('given global order thresholds when the cart is above the maximum and then below it then checkout is blocked and the soft threshold fee is charged', (): void => {
      // Arrange
      loginAsBackofficeUser();
      globalThresholdPage.applyThresholds({
        storeCurrency: STORE_CURRENCY,
        minimumValue: MINIMUM_VALUE,
        minimumMessage: THRESHOLD_MESSAGES.minimum,
        maximumValue: MAXIMUM_VALUE,
        maximumMessage: THRESHOLD_MESSAGES.maximum,
        softStrategy: SOFT_STRATEGY_FIXED_FEE,
        softValue: SOFT_VALUE,
        softMessage: THRESHOLD_MESSAGES.soft,
        softFixedFee: SOFT_FIXED_FEE,
      });
      globalThresholdPage.getSavedMessage().should('be.visible');

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
        withoutSession: true,
        resetSession: true,
      });

      cartPage.visit();
      cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: QUANTITY_ABOVE_MAXIMUM });

      // Assert
      cartPage.getThresholdSurcharge().should('contain', EXPECTED_SURCHARGE);

      // Act
      checkoutScenario.execute({
        shouldSkipPlaceOrder: true,
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      checkoutSummaryPage.getThresholdSurcharge().should('contain', EXPECTED_SURCHARGE);
      checkoutSummaryPage.getThresholdMessage(EXPECTED_MAXIMUM_MESSAGE).should('be.visible');

      // Act
      cartPage.visit();
      cartPage.changeQuantity({ sku: dynamicFixtures.product.sku, quantity: QUANTITY_BELOW_MAXIMUM });

      // Assert
      cartPage.getThresholdSurcharge().should('contain', EXPECTED_SURCHARGE);

      // Act
      // Changing the quantity invalidates the shipment step, so the checkout resumes there rather
      // than at the summary; the address it already holds is not asked for a second time.
      checkoutScenario.execute({
        shouldSkipAddressStep: true,
        shouldSkipPlaceOrder: true,
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      // Assert
      checkoutSummaryPage.getThresholdSurcharge().should('contain', EXPECTED_SURCHARGE);
      checkoutSummaryPage.getThresholdMessage(EXPECTED_MAXIMUM_MESSAGE).should('not.exist');

      // Act
      checkoutSummaryPage.placeOrder();

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });
    });

    function loginAsBackofficeUser(): void {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    }
  }
);
