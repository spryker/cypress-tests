import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../../yves-page';
import { CommentCartRepository } from './comment-cart-repository';

@injectable()
@autoWired
export class CommentCartPage extends YvesPage {
  protected PAGE_URL: string = '/cart';

  constructor(@inject(TYPES.CommentCartRepository) private repository: CommentCartRepository) {
    super();
  }

  public addComment = (commentMessage: string): void => {
    this.repository.getAddCommentForm().last().find('textarea').clear().type(commentMessage);
    this.repository.getAddCommentForm().last().find(this.repository.getAddCommentButtonSelector()).click();
  };

  public updateFirstComment = (commentMessage: string): void => {
    const textarea = this.repository.getFirstCommentTextarea();
    textarea.clear().type(commentMessage);

    this.getCommentThreadListSection().first().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  public updateCommentByCommentText = (initialCommentMessage: string, newCommentMessage: string): void => {
    const textarea = this.repository.getCommentTextareaByCommentText(initialCommentMessage);

    textarea.clear().type(newCommentMessage);
    textarea.parent().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  public removeCommentByCommentText = (commentMessage: string): void => {
    this.repository
      .getCommentTextareaByCommentText(commentMessage)
      .parent()
      .find(this.repository.getRemoveCommentButtonSelector())
      .click();
  };

  public removeFirstComment = (): void => {
    this.getCommentThreadListSection().find(this.repository.getRemoveCommentButtonSelector()).click();
  };

  public getCommentThreadListSection = (): Cypress.Chainable => {
    return this.repository.getCommentThreadListSection();
  };
}
