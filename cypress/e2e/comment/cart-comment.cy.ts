import { Page as CommentCartPage } from '../../support/pages/yves/comment/cart/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CreateCartScenario } from '../../support/scenarios/create-cart-scenario';
import { container } from '../../support/utils/inversify/inversify.config';

describe('cart comment', (): void => {
  let fixtures: CartCommentFixtures;

  let cartPage: CartPage;
  let commentCartPage: CommentCartPage;
  let loginCustomerScenario: LoginCustomerScenario;
  let createCartScenario: CreateCartScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    commentCartPage = container.get(CommentCartPage);
    cartPage = container.get(CartPage);
    loginCustomerScenario = container.get(LoginCustomerScenario);
    createCartScenario = container.get(CreateCartScenario);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();

    loginCustomerScenario.execute(fixtures.customer);
    createCartScenario.execute();
  });

  it('customer should be able to add comments to empty cart [@comment]', (): void => {
    fixtures.comments.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);
      commentCartPage.assertCommentMessage(commentMessage);
    });
  });

  it('customer should be able to add comments to cart [@comment]', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    fixtures.comments.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);
      commentCartPage.assertCommentMessage(commentMessage);
    });
  });

  it('customer should be able to modify comment in empty cart [@comment]', (): void => {
    commentCartPage.addComment(fixtures.comments[0]);
    commentCartPage.updateFirstComment(fixtures.comments[1]);

    commentCartPage.assertCommentMessage(fixtures.comments[1]);
  });

  it('customer should be able to modify comment in cart [@comment]', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    commentCartPage.addComment(fixtures.comments[0]);
    commentCartPage.updateFirstComment(fixtures.comments[1]);

    commentCartPage.assertCommentMessage(fixtures.comments[1]);
  });

  it('customer should be able to remove comment in empty cart [@comment]', (): void => {
    commentCartPage.addComment(fixtures.comments[0]);

    commentCartPage.removeFirstComment();
    commentCartPage.assertEmptyCommentThreadList();
  });

  it('customer should be able to remove comment in cart [@comment]', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);
    commentCartPage.addComment(fixtures.comments[0]);

    commentCartPage.removeFirstComment();
    commentCartPage.assertEmptyCommentThreadList();
  });
});
