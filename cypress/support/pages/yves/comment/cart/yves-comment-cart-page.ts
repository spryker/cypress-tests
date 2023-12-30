import 'reflect-metadata';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCommentCartRepository } from './yves-comment-cart-repository';

@injectable()
@autoProvide
export class YvesCommentCartPage extends AbstractPage {
  public PAGE_URL: string = '/cart';

  constructor(
    @inject(TYPES.CommentCartRepository)
    private repository: YvesCommentCartRepository
  ) {
    super();
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
      .find(this.repository.getAddCommentButtonSelector())
      .click();
  };

  updateFirstComment = (commentMessage: string): void => {
    const textarea = this.repository.getFirstCommentTextarea();
    textarea.clear().type(commentMessage);

    this.repository
      .getCommentThreadListSection()
      .first()
      .find(this.repository.getUpdateCommentButtonSelector())
      .click();
  };

  removeFirstComment = (): void => {
    this.repository
      .getCommentThreadListSection()
      .first()
      .find(this.repository.getRemoveCommentButtonSelector())
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
