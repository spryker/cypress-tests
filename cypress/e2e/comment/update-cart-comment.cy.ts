import { CommentPage } from "../../support/pages/yves/comment/cart/comment.page";
import { CartPage } from "../../support/pages/yves/cart/cart.page";
import { LoggedInCustomerWithNewCartScenario } from "../../support/scenarios/cart/logged-in-customer-with-new-cart.scenario";

describe("update cart comment", () => {
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

    LoggedInCustomerWithNewCartScenario.execute(
      fixtures.customer.email,
      fixtures.customer.password,
    );
  });

  it("customer should be able to modify comment in empty cart", () => {
    commentPage.addComment(fixtures.comments[0]);
    commentPage.updateFirstComment(fixtures.comments[1]);

    commentPage.assertCommentMessage(fixtures.comments[1]);
  });

  it("customer should be able to modify comment in cart", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    commentPage.addComment(fixtures.comments[0]);
    commentPage.updateFirstComment(fixtures.comments[1]);

    commentPage.assertCommentMessage(fixtures.comments[1]);
  });
});
