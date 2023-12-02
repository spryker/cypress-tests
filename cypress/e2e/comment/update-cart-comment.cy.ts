import { CommentPage } from '../../support/pages/yves/comment/cart/comment.page';
import { CartPage } from '../../support/pages/yves/cart/cart.page';
import { LoginAsCustomerWithNewCartScenario } from '../../support/scenarios/cart/login-as-customer-with-new-cart.scenario';
import { CommentFixture } from '../../support';

describe('update cart comment', () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginAsCustomerWithNewCartScenario.execute(fixtures.customer);
    });
  });

  it('customer should be able to modify comment in empty cart', () => {
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      commentPage.addComment(fixtures.comments[0]);
      commentPage.updateFirstComment(fixtures.comments[1]);

      commentPage.assertCommentMessage(fixtures.comments[1]);
    });
  });

  it('customer should be able to modify comment in cart', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSku);

      commentPage.addComment(fixtures.comments[0]);
      commentPage.updateFirstComment(fixtures.comments[1]);

      commentPage.assertCommentMessage(fixtures.comments[1]);
    });
  });
});
