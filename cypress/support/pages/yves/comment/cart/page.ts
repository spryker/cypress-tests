import 'reflect-metadata';
import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../utils/inversify/types';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/cart';
  repository: Repository;

  constructor(@inject(TYPES.CommentCartRepository) repository: Repository) {
    super();
    this.repository = repository;
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
