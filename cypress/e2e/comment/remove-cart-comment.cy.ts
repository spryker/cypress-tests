import { CommentPage } from "../../support/pages/yves/comment/cart/comment.page";
import { CartPage } from "../../support/pages/yves/cart/cart.page";
import { LoginAsCustomerWithNewCartScenario } from "../../support/scenarios/cart/login-as-customer-with-new-cart.scenario";

describe("remove cart comment", () => {
  const commentPage = new CommentPage();
  const cartPage = new CartPage();
  let fixtures: CommentFixtures;

  before(() => {
    cy.fixture("comment/data").then(
      (data: CommentFixtures) => (fixtures = data),
    );
  });

  beforeEach(() => {
    cy.resetCookies();

    LoginAsCustomerWithNewCartScenario.execute(
      fixtures.customer.email,
      fixtures.customer.password,
    );
  });

  it("customer should be able to remove comment in empty cart", () => {
    commentPage.addComment(fixtures.comments[0]);
    commentPage.removeFirstComment();

    commentPage.assertEmptyCommentThreadList();
  });

  it("customer should be able to remove comment in cart", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    commentPage.addComment(fixtures.comments[0]);
    commentPage.removeFirstComment();

    commentPage.assertEmptyCommentThreadList();
  });
});
