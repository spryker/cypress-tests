import { container } from '@utils';
import { CartCommentsDynamicFixtures, CartCommentsStaticFixtures } from '@interfaces/yves';
import { CommentCartPage, MultiCartPage, CartPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('cart comments', { tags: ['@comments'] }, (): void => {
  const multiCartPage = container.get(MultiCartPage);
  const commentCartPage = container.get(CommentCartPage);
  const cartPage = container.get(CartPage);
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
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });

    commentCartPage.visitCartWithItems();
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.add({ message: commentMessage });
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in cart with items', (): void => {
    commentCartPage.visitCartWithItems();
    commentCartPage.add({ message: staticFixtures.commentToModify });
    commentCartPage.update({ oldMessage: staticFixtures.commentToModify, newMessage: staticFixtures.modifiedComment });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in cart with items', (): void => {
    commentCartPage.visitCartWithItems();
    commentCartPage.add({ message: staticFixtures.commentsToRemove });
    commentCartPage.remove({ message: staticFixtures.commentsToRemove });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });

  it('customer should be able to add comments to empty cart', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.emptyQuote.name });

    commentCartPage.visit();
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.add({ message: commentMessage });
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });
  });

  it('customer should be able to modify comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentToModify });
    commentCartPage.update({ oldMessage: staticFixtures.commentToModify, newMessage: staticFixtures.modifiedComment });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.modifiedComment).should('exist');
  });

  it('customer should be able to remove comment in empty cart', (): void => {
    commentCartPage.visit();
    commentCartPage.add({ message: staticFixtures.commentsToRemove });
    commentCartPage.remove({ message: staticFixtures.commentsToRemove });

    commentCartPage.getCommentThreadListSection().contains(staticFixtures.commentsToRemove).should('not.exist');
  });

  it('adding a comment to cart with items should not scroll the page to the top', (): void => {
    cy.viewport(800, 800);
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });

    commentCartPage.visitCartWithItems();
    staticFixtures.commentsToAdd.forEach((commentMessage) => {
      commentCartPage.add({ message: commentMessage });
      commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
    });

    cy.window().then((win) => {
      expect(win.scrollY).not.equal(0);
    });
  });

  it('adding cart item note should not reload the whole cart block', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart({ name: dynamicFixtures.quote.name });
    commentCartPage.visitCartWithItems();

    cartPage
      .getCheckoutButton()
      .invoke('append', '<div class="added-html">Added HTML</div>')
      .then(() => {
        staticFixtures.commentsToAdd.forEach((commentMessage) => {
          commentCartPage.add({ message: commentMessage });
          commentCartPage.getCommentThreadListSection().contains(commentMessage).should('exist');
        });

        cartPage.getCheckoutButton().then(($button) => {
          expect($button.find('.added-html')).to.exist;
        });
      });
  });
});
