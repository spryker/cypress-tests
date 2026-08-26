import { container, getPaymentMethodBasedOnEnv } from '@utils';
import { CartCommentsDynamicFixtures, CartCommentsStaticFixtures } from '@interfaces/yves';
import { CheckoutSummaryPage, CommentCartPage, CustomerOverviewPage, MultiCartPage } from '@pages/yves';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario, ProductAddToCartScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('cart comments', { tags: ['@yves', '@comments', 'cart', 'marketplace-cart', 'spryker-core'] }, (): void => {
  if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
    it.skip('skipped because tests run only for suite and b2b and b2b-mp', () => {});
    return;
  }
  const multiCartPage = container.get(MultiCartPage);
  const commentCartPage = container.get(CommentCartPage);
  const customerOverviewPage = container.get(CustomerOverviewPage);
  const checkoutSummaryPage = container.get(CheckoutSummaryPage);
  const salesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage = container.get(SalesDetailPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);
  const checkoutScenario = container.get(CheckoutScenario);
  const productAddToCartScenario = container.get(ProductAddToCartScenario);
  const userLoginScenario = container.get(UserLoginScenario);

  let dynamicFixtures: CartCommentsDynamicFixtures;
  let staticFixtures: CartCommentsStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  it('customer should be able to add comments to cart with items', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });

    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.add({ message: commentMessage });
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in cart with items', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentToModify });
    commentCartPage.update({
      oldMessage: staticFixtures.commentToModify,
      newMessage: staticFixtures.modifiedComment,
    });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in cart with items', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentsToRemove });
    commentCartPage.remove({ message: staticFixtures.commentsToRemove });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });

  it('customer should be able to add comments to empty cart', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.emptyQuote.name });

    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.add({ message: commentMessage });
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentToModify });
    commentCartPage.update({
      oldMessage: staticFixtures.commentToModify,
      newMessage: staticFixtures.modifiedComment,
    });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentsToRemove });
    commentCartPage.remove({ message: staticFixtures.commentsToRemove });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });
  it('given a cart carrying a comment when the order is placed then the comment is on the order in the storefront and in the back office', (): void => {
    // Arrange
    // The product is added to whatever cart is active rather than a named fixture cart: checkout
    // consumes the cart, so a retry of this test must not depend on a cart an earlier attempt spent.
    productAddToCartScenario.execute({ sku: dynamicFixtures.product1.sku });
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentToKeepThroughCheckout });
    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentToKeepThroughCheckout).should('exist');

    // Act
    checkoutScenario.execute({
      shouldTriggerOmsInCli: true,
      paymentMethod: getPaymentMethodBasedOnEnv(),
    });

    customerOverviewPage.assertBodyContainsText(customerOverviewPage.getPlacedOrderSuccessMessage(), {
      timeout: 15000,
    });

    // Assert
    // The comment has to survive the cart-to-order copy, so it is read back on the storefront
    // order details page and again in the back office, not just on the cart it was written on.
    checkoutSummaryPage.getPlacedOrderReference().then((orderReference: string) => {
      customerOverviewPage.viewLastPlacedOrder();
      commentCartPage
        .getCommentThreadListSection()
        .contains(staticFixtures.commentToKeepThroughCheckout)
        .should('exist');

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      salesIndexPage.visit();
      salesIndexPage.viewByReference(orderReference);

      salesDetailPage.getOrderComments().should('contain', staticFixtures.commentToKeepThroughCheckout);
    });
  });
});
