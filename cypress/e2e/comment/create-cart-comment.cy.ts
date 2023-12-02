import { CommentPage } from '../../support/pages/yves/comment/cart/comment.page';
import { CartPage } from '../../support/pages/yves/cart/cart.page';
import { LoginAsCustomerWithNewCartScenario } from '../../support/scenarios/cart/login-as-customer-with-new-cart.scenario';
import { CommentFixture } from '../../support';

describe('create cart comment', () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginAsCustomerWithNewCartScenario.execute(fixtures.customer);
    });
  });

  it('customer should be able to add comments to empty cart', () => {
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      fixtures.comments.forEach((commentMessage) => {
        commentPage.addComment(commentMessage);
        commentPage.assertCommentMessage(commentMessage);
      });
    });
  });

  it('customer should be able to add comments to cart', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSku);

      fixtures.comments.forEach((commentMessage) => {
        commentPage.addComment(commentMessage);
        commentPage.assertCommentMessage(commentMessage);
      });
    });
  });
});
