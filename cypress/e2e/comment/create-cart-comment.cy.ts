import { Page as CommentPage } from '../../support/pages/yves/comment/cart/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CommentFixture } from '../../support';
import { CreateCartScenario } from "../../support/scenarios/create-cart-scenario";

describe('create cart comment', () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginCustomerScenario.execute(fixtures.customer);
      CreateCartScenario.execute();
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
