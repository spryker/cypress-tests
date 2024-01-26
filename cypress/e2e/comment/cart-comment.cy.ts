import { container } from '../../support/utils/inversify/inversify.config';
import { YvesCartPage } from '../../support/pages/yves/cart/yves-cart-page';
import { YvesCommentCartPage } from '../../support/pages/yves/comment/cart/yves-comment-cart-page';
import { YvesLoginCustomerScenario } from '../../support/scenarios/yves/yves-login-customer-scenario';
import { CreateCartScenario } from '../../support/scenarios/yves/create-cart-scenario';

describe('cart comment', (): void => {
  let fixtures: CartCommentFixtures;

  let cartPage: YvesCartPage;
  let commentCartPage: YvesCommentCartPage;
  let loginCustomerScenario: YvesLoginCustomerScenario;
  let createCartScenario: CreateCartScenario;

  before((): void => {
    fixtures = Cypress.env('fixtures');

    cartPage = container.get(YvesCartPage);
    commentCartPage = container.get(YvesCommentCartPage);
    loginCustomerScenario = container.get(YvesLoginCustomerScenario);
    createCartScenario = container.get(CreateCartScenario);
  });

  beforeEach((): void => {
    cy.resetYvesCookies();

    loginCustomerScenario.execute(fixtures.customer);
    createCartScenario.execute();
  });

  it('customer should be able to add comments to empty cart', (): void => {
    fixtures.comments.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);

      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to add comments to cart', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    fixtures.comments.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in empty cart', (): void => {
    commentCartPage.addComment(fixtures.comments[0]);
    commentCartPage.updateFirstComment(fixtures.comments[1]);

    commentCartPage.getCommentThreadListSection().contains(fixtures.comments[1]).should('exist');
  });

  it('customer should be able to modify comment in cart', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);

    commentCartPage.addComment(fixtures.comments[0]);
    commentCartPage.updateFirstComment(fixtures.comments[1]);

    commentCartPage.getCommentThreadListSection().contains(fixtures.comments[1]).should('exist');
  });

  it('customer should be able to remove comment in empty cart', (): void => {
    commentCartPage.addComment(fixtures.comments[0]);

    commentCartPage.removeFirstComment();
    commentCartPage.getCommentThreadListSection().should('not.exist');
  });

  it('customer should be able to remove comment in cart', (): void => {
    cy.visit(cartPage.PAGE_URL);
    cartPage.quickAddToCart(fixtures.concreteProductSku);
    commentCartPage.addComment(fixtures.comments[0]);

    commentCartPage.removeFirstComment();
    commentCartPage.getCommentThreadListSection().should('not.exist');
  });
});
