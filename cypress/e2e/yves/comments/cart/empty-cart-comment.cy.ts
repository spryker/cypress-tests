import { container } from '../../../../support/utils/inversify/inversify.config';
import { CommentCartPage } from '../../../../support/pages/yves';
import { CustomerLoginScenario } from '../../../../support/scenarios/yves';
import { CartCommentDynamicFixtures, CartCommentStaticFixtures } from '../../../../support/types/yves/comments/cart';

describe('empty cart comment', { tags: ['@comments'] }, (): void => {
  const commentCartPage: CommentCartPage = container.get(CommentCartPage);
  const loginCustomerScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: CartCommentDynamicFixtures;
  let staticFixtures: CartCommentStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.customer.password);
    commentCartPage.visit();
  });

  it('customer should be able to add comments to empty cart', (): void => {
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);

      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in empty cart', (): void => {
    commentCartPage.addComment(staticFixtures.commentToModify);
    commentCartPage.updateCommentByCommentText(staticFixtures.commentToModify, staticFixtures.modifiedComment);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in empty cart', (): void => {
    commentCartPage.addComment(staticFixtures.commentsToRemove);
    commentCartPage.removeCommentByCommentText(staticFixtures.commentsToRemove);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });
});
