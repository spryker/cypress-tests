import { CartCommentsDynamicFixtures, CartCommentsStaticFixtures } from '@interfaces/yves';
import { CommentCartPage, MultiCartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { container } from '@utils';

describe('cart comments', { tags: ['@comments'] }, (): void => {
  const multiCartPage = container.get(MultiCartPage);
  const commentCartPage = container.get(CommentCartPage);
  const loginCustomerScenario = container.get(CustomerLoginScenario);

  let dynamicFixtures: CartCommentsDynamicFixtures;
  let staticFixtures: CartCommentsStaticFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    loginCustomerScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
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
