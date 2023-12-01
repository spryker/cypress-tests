import { LoginPage } from "../../support/pages/yves/login/login.page";
import { MultiCartPage } from "../../support/pages/yves/multi-cart/multi.cart.page";
import { CommentPage } from "../../support/pages/yves/comment/cart/comment.page";
import { CartPage } from "../../support/pages/yves/cart/cart.page";
import { LoggedInCustomerWithNewCartScenario } from "../../support/scenarios/cart/logged-in-customer-with-new-cart.scenario";

describe("create cart comment", () => {
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

  it("customer should be able to add comments to empty cart", () => {
    fixtures.comments.forEach((commentMessage) => {
      commentPage.addComment(commentMessage);
      commentPage.assertCommentMessage(commentMessage);
    });
  });

  it("customer should be able to add comments to cart", () => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    fixtures.comments.forEach((commentMessage) => {
      commentPage.addComment(commentMessage);
      commentPage.assertCommentMessage(commentMessage);
    });
  });
});
