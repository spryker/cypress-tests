export class CommentRepository {
  getAddCommentForm = () => {
    return cy.get('[data-qa="component comment-form"]');
  };

  getCommentThreadListSection = () => {
    return cy.get('[data-qa="component comment-thread-list"]');
  };
}
