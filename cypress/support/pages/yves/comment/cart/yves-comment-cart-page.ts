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

  constructor(@inject(TYPES.YvesCommentCartRepository) private repository: YvesCommentCartRepository) {
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

  public removeFirstComment = (): void => {
    this.getCommentThreadListSection().first().find(this.repository.getRemoveCommentButtonSelector()).click();
  };

  public getCommentThreadListSection = (): Cypress.Chainable => {
    return this.repository.getCommentThreadListSection();
  };
}
