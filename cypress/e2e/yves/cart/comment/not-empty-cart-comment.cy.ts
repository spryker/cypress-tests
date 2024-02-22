import { container } from '../../../../support/utils/inversify/inversify.config';
import {CartCommentDynamicFixtures, CartCommentStaticFixtures} from "../../../../support/types/yves/cart/comment";
import {CommentCartPage} from "../../../../support/pages/yves";
import {CustomerLoginScenario} from "../../../../support/scenarios/yves";

describe('cart comment', (): void => {
  let dynamicFixtures: CartCommentDynamicFixtures;
  let staticFixtures: CartCommentStaticFixtures;
  let commentCartPage: CommentCartPage;
  let loginCustomerScenario: CustomerLoginScenario;

  before((): void => {
    cy.resetYvesCookies();
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    commentCartPage = container.get(CommentCartPage);
    loginCustomerScenario = container.get(CustomerLoginScenario);
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    commentCartPage.visit();
  });

  it('customer should be able to add comments to cart [@comment]', (): void => {
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);

      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in cart [@comment]', (): void => {
    commentCartPage.addComment(staticFixtures.commentToModify);
    commentCartPage.updateCommentByCommentText(staticFixtures.commentToModify, staticFixtures.modifiedComment);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in cart [@comment]', (): void => {
    commentCartPage.addComment(staticFixtures.commentsToRemove);
    commentCartPage.removeCommentByCommentText(staticFixtures.commentsToRemove);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });
});