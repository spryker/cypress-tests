import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CommentFixture } from '../../support';
import { Page as CommentPage } from '../../support/pages/yves/comment/cart/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { CreateCartScenario } from "../../support/scenarios/create-cart-scenario";

describe('update cart comment', () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginCustomerScenario.execute(fixtures.customer);
      CreateCartScenario.execute();
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
