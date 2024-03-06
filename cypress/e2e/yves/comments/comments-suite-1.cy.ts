import { CommentCartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';
import {
  CommentsSuite1DynamicFixtures,
  CommentsSuite1StaticFixtures,
} from '../../../support/types/yves/comments/fixture-types';

describe('comments suite 1', { tags: ['@comments'] }, (): void => {
  const multiCartPage: MultiCartPage = container.get(MultiCartPage);
  const commentCartPage: CommentCartPage = container.get(CommentCartPage);
  const loginCustomerScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: CommentsSuite1DynamicFixtures;
  let staticFixtures: CommentsSuite1StaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);
  });

  it('customer should be able to add comments to cart with items', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart(dynamicFixtures.quote.name);

    commentCartPage.visit();
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in cart with items', (): void => {
    commentCartPage.visit();
    commentCartPage.addComment(staticFixtures.commentToModify);
    commentCartPage.updateCommentByCommentText(staticFixtures.commentToModify, staticFixtures.modifiedComment);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in cart with items', (): void => {
    commentCartPage.visit();
    commentCartPage.addComment(staticFixtures.commentsToRemove);
    commentCartPage.removeCommentByCommentText(staticFixtures.commentsToRemove);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });

  it('customer should be able to add comments to empty cart', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart(dynamicFixtures.emptyQuote.name);

    commentCartPage.visit();
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.addComment(commentMessage);
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.addComment(staticFixtures.commentToModify);
    commentCartPage.updateCommentByCommentText(staticFixtures.commentToModify, staticFixtures.modifiedComment);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.addComment(staticFixtures.commentsToRemove);
    commentCartPage.removeCommentByCommentText(staticFixtures.commentsToRemove);

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });
});
