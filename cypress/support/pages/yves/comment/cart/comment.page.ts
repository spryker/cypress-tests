import { Page } from '../../../page';
import { CommentRepository } from './comment.repository';

export class CommentPage extends Page {
  PAGE_URL = '/cart';
  repository: CommentRepository;

  constructor() {
    super();
    this.repository = new CommentRepository();
  }

  addComment = (commentMessage: string): void => {
    this.repository
      .getAddCommentForm()
      .last()
      .find('textarea')
      .clear()
      .type(commentMessage);
    this.repository
      .getAddCommentForm()
      .last()
      .find('button:contains("Add")')
      .click();
  };

  updateFirstComment = (commentMessage: string): void => {
    this.repository
      .getAddCommentForm()
      .first()
      .find('textarea')
      .clear()
      .type(commentMessage);
    this.repository
      .getAddCommentForm()
      .first()
      .find('button:contains("Update")')
      .click();
  };

  removeFirstComment = (): void => {
    this.repository
      .getAddCommentForm()
      .first()
      .find('button:contains("Remove")')
      .click();
  };

  assertCommentMessage = (commentMessage: string): void => {
    this.repository
      .getCommentThreadListSection()
      .contains(commentMessage)
      .should('exist');
  };

  assertEmptyCommentThreadList = (): void => {
    this.repository.getCommentThreadListSection().should('not.exist');
  };
}
