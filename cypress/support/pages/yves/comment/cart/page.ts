import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/cart';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
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
