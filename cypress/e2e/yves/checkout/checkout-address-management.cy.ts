import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CheckoutAddressManagementDynamicFixtures, CheckoutAddressManagementStaticFixtures } from '@interfaces/yves';
import {
  CartPage,
  CheckoutAddressPage,
  CheckoutPaymentPage,
  CheckoutShipmentPage,
  CheckoutSummaryPage,
  CustomerAddressPage,
  CustomerOverviewPage,
} from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'checkout address management',
  { tags: ['@yves', '@checkout', 'checkout', 'cart', 'customer-account-management', 'spryker-core'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const checkoutAddressPage = container.get(CheckoutAddressPage);
    const checkoutShipmentPage = container.get(CheckoutShipmentPage);
    const checkoutPaymentPage = container.get(CheckoutPaymentPage);
    const checkoutSummaryPage = container.get(CheckoutSummaryPage);
    const customerAddressPage = container.get(CustomerAddressPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const productAddToCartScenario = container.get(ProductAddToCartScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CheckoutAddressManagementStaticFixtures;
    let dynamicFixtures: CheckoutAddressManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a separate billing address when the customer returns to the address step and changes both addresses then the order takes the changed ones and only the address marked for saving is added to the address book', (): void => {
      // Arrange
      // This spec drives the checkout steps itself rather than going through CheckoutScenario, so
      // it has to repeat the stub the scenario applies: the recurring-order/clear response replaces
      // the summary form HTML, unchecking the terms box and disabling submit before placeOrder runs.
      cy.intercept('POST', '**/recurring-order/clear', { statusCode: 200, body: '' });

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });

      cartPage.visit();
      cartPage.startCheckout();

      // A billing address entered on the first pass and then replaced on the second is what the
      // source guarded: the order must not keep the address the customer navigated away from.
      checkoutAddressPage.setBillingSameAsShipping(false);
      checkoutAddressPage.selectExistingShippingAddress(dynamicFixtures.address.id_customer_address);
      checkoutAddressPage.typeBillingAddress(staticFixtures.discardedBillingAddress);
      checkoutAddressPage.setBillingAddressSavedToAddressBook(false);
      checkoutAddressPage.submitAddressStep();

      checkoutShipmentPage.setStandardShippingMethod();

      // Act
      // Returning to the address step, which is what makes this a re-edit rather than a first entry.
      checkoutAddressPage.visit();
      checkoutAddressPage.setBillingSameAsShipping(false);
      checkoutAddressPage.typeShippingAddress(staticFixtures.savedShippingAddress);
      checkoutAddressPage.setShippingAddressSavedToAddressBook(true);
      checkoutAddressPage.typeBillingAddress(staticFixtures.orderBillingAddress);
      checkoutAddressPage.setBillingAddressSavedToAddressBook(false);
      checkoutAddressPage.submitAddressStep();

      checkoutShipmentPage.setStandardShippingMethod();
      checkoutPaymentPage.setPaymentMethod(getPaymentMethodBasedOnEnv());
      checkoutSummaryPage.placeOrder();

      cy.url({ timeout: 15000 }).should('not.include', '/checkout/summary');

      // Assert
      customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
        timeout: 15000,
      });

      checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
        // Only the shipping address was marked for saving, so only it may reach the address book.
        customerAddressPage.visit();
        customerAddressPage.getBody().should('contain', staticFixtures.savedShippingAddress.address1);
        customerAddressPage.getBody().should('not.contain', staticFixtures.orderBillingAddress.address1);
        customerAddressPage.getBody().should('not.contain', staticFixtures.discardedBillingAddress.address1);

        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });
        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference);

        salesDetailPage.getBillingAddress().should('contain', staticFixtures.orderBillingAddress.address1);
        salesDetailPage.getShipmentDeliveryAddresses().should('contain', staticFixtures.savedShippingAddress.address1);
      });
    });
  }
);
