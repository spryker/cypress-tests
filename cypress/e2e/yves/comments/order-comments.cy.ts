import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { OrderCommentsDynamicFixtures, OrderCommentsStaticFixtures } from '@interfaces/yves';
import { CommentCartPage, CustomerOverviewPage, OrderDetailsPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

// Commenting on an order is a company-account journey; the B2C storefronts do not carry it, which
// is the same variant set the source test was written for.
const UNSUPPORTED_REPOSITORY_IDS = ['b2c', 'b2c-mp'];

describe(
  'order comments',
  {
    tags: ['@yves', '@comments', 'order-management', 'marketplace-order-management', 'spryker-core'],
  },
  (): void => {
    if (UNSUPPORTED_REPOSITORY_IDS.includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b and b2b-mp', () => {});

      return;
    }

    const customerOverviewPage = container.get(CustomerOverviewPage);
    const orderDetailsPage = container.get(OrderDetailsPage);
    // The comment thread is one widget rendered on both the cart and the order details page, so the
    // page object that drives it on the cart drives it here too.
    const commentThreadPage = container.get(CommentCartPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const checkoutScenario = container.get(CheckoutScenario);

    let staticFixtures: OrderCommentsStaticFixtures;
    let dynamicFixtures: OrderCommentsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a placed order when the customer comments on it in the storefront then the comment is shown there and in the back office', (): void => {
      // Arrange
      placeCustomerOrder();
      customerOverviewPage.viewLastPlacedOrder();

      // Act
      commentThreadPage.add({ message: staticFixtures.commentOnOrder });

      // Assert
      commentThreadPage.getCommentThreadListSection().contains(staticFixtures.commentOnOrder).should('exist');

      orderDetailsPage.getOrderReferenceBlock().then((orderReference: string) => {
        userLoginScenario.execute({
          username: dynamicFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        salesIndexPage.visit();
        salesIndexPage.viewByReference(orderReference.trim());

        salesDetailPage.getOrderComments().should('contain', staticFixtures.commentOnOrder);
      });
    });

    function placeCustomerOrder(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutScenario.execute({
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        paymentMethod: getPaymentMethodBasedOnEnv(),
        shouldTriggerOmsInCli: true,
      });
    }
  }
);
