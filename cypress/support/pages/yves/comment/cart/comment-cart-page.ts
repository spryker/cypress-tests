import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { CommentCartRepository } from './comment-cart-repository';

@injectable()
@autoWired
export class CommentCartPage extends YvesPage {
  @inject(REPOSITORIES.CommentCartRepository) private repository: CommentCartRepository;

  protected PAGE_URL = '/cart';

  addComment = (commentMessage: string): void => {
    this.repository.getAddCommentForm().last().find('textarea').clear().type(commentMessage);
    this.repository.getAddCommentForm().last().find(this.repository.getAddCommentButtonSelector()).click();
  };

  updateFirstComment = (commentMessage: string): void => {
    const textarea = this.repository.getFirstCommentTextarea();
    textarea.clear().type(commentMessage);

    this.getCommentThreadListSection().first().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  updateCommentByCommentText = (initialCommentMessage: string, newCommentMessage: string): void => {
    const textarea = this.repository.getCommentTextareaByCommentText(initialCommentMessage);

    textarea.clear().type(newCommentMessage);
    textarea.parent().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  removeCommentByCommentText = (commentMessage: string): void => {
    this.repository
      .getCommentTextareaByCommentText(commentMessage)
      .parent()
      .find(this.repository.getRemoveCommentButtonSelector())
      .click();
  };

  removeFirstComment = (): void => {
    this.getCommentThreadListSection().find(this.repository.getRemoveCommentButtonSelector()).click();
  };

  getCommentThreadListSection = (): Cypress.Chainable => {
    return this.repository.getCommentThreadListSection();
  };
}
