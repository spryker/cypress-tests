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

  public visit = (): void => {
    cy.visit(this.PAGE_URL);
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
