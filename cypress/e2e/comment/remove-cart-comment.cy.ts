import { CommentPage } from '../../support/pages/yves/comment/cart/comment.page';
import { CartPage } from '../../support/pages/yves/cart/cart.page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CommentFixture } from '../../support';

describe('remove cart comment', () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginCustomerScenario.execute(fixtures.customer);
    });
  });

  it('customer should be able to remove comment in empty cart', () => {
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      commentPage.addComment(fixtures.comments[0]);
    });

    commentPage.removeFirstComment();
    commentPage.assertEmptyCommentThreadList();
  });

  it('customer should be able to remove comment in cart', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSku);
      commentPage.addComment(fixtures.comments[0]);
    });

    commentPage.removeFirstComment();
    commentPage.assertEmptyCommentThreadList();
  });
});
