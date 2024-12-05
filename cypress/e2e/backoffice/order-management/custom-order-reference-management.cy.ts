import { container } from '@utils';
import {
  CustomOrderReferenceManagementStaticFixtures,
  CustomOrderReferenceManagementDynamicFixtures,
} from '@interfaces/backoffice';
import { SalesIndexPage } from '@pages/backoffice';
import { CartPage, CustomerOverviewPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';

(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'custom order reference management',
  { tags: ['@backoffice', '@order-management'] },
  (): void => {
    const cartPage = container.get(CartPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);
    const loginCustomerScenario = container.get(CustomerLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CustomOrderReferenceManagementStaticFixtures;
    let dynamicFixtures: CustomOrderReferenceManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('should be able to create an order with custom order reference', (): void => {
      loginCustomerScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      cartPage.visit();
      cartPage.addCustomOrderReferenceInput(staticFixtures.orderReference);

      checkoutScenario.execute({
        paymentMethod: getPaymentMethodBasedOnEnv(),
      });

      cy.contains(customerOverviewPage.getPlacedOrderSuccessMessage());

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();

      cy.get('body').contains(staticFixtures.orderReference);
    });

    function getPaymentMethodBasedOnEnv(): string {
      return ['b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))
        ? 'dummyMarketplacePaymentInvoice'
        : 'dummyPaymentInvoice';
    }
  }
);
