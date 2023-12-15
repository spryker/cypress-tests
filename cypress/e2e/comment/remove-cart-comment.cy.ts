import { Page as CommentCartPage } from '../../support/pages/yves/comment/cart/page';
import { Page as CartPage } from '../../support/pages/yves/cart/page';
import { LoginCustomerScenario } from '../../support/scenarios/login-customer-scenario';
import { CommentFixture } from '../../support';
import { CreateCartScenario } from '../../support/scenarios/create-cart-scenario';
import { container } from '../../support/utils/inversify.config';

describe('remove cart comment', (): void => {
  let cartPage: CartPage;
  let commentCartPage: CommentCartPage;
  let fixtures: CommentFixture;

  before((): void => {
    commentCartPage = container.get(CommentCartPage);
    cartPage = container.get(CartPage);

    cy.fixture('comment.' + Cypress.env('repositoryId')).then(
      (commentFixtures: CommentFixture) => {
        fixtures = commentFixtures;
      }
    );
  });

  beforeEach((): void => {
    cy.resetCookies();

    container.get(LoginCustomerScenario).execute(fixtures.customer);
    container.get(CreateCartScenario).execute();
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
