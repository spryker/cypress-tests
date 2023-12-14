import { Page as CommentCartPage } from '../../support/pages/yves/comment/cart/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CommentFixture } from '../../support';
import { CreateCartScenario } from '../../support/scenarios/create-cart-scenario';
import { container } from '../../support/inversify.config';

describe('remove cart comment', () => {
  let commentCartPage: CommentCartPage;
  let cartPage: CartPage;

  before(() => {
    commentCartPage = container.get(CommentCartPage);
    cartPage = container.get(CartPage);
  });

  beforeEach(() => {
    cy.resetCookies();

    cy.fixture('comment').then((fixtures: CommentFixture) => {
      LoginCustomerScenario.execute(fixtures.customer);
      CreateCartScenario.execute();
    });
  });

  it('customer should be able to remove comment in empty cart [@comment]', () => {
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      commentCartPage.addComment(fixtures.comments[0]);
    });

    commentCartPage.removeFirstComment();
    commentCartPage.assertEmptyCommentThreadList();
  });

  it('customer should be able to remove comment in cart [@comment]', () => {
    cy.visit(cartPage.PAGE_URL);
    cy.fixture('comment').then((fixtures: CommentFixture) => {
      cartPage.quickAddToCart(fixtures.concreteProductSku);
      commentCartPage.addComment(fixtures.comments[0]);
    });

    commentCartPage.removeFirstComment();
    commentCartPage.assertEmptyCommentThreadList();
  });
});
