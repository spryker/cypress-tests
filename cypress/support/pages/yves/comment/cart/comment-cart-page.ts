import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CommentCartRepository } from './comment-cart-repository';

@injectable()
@autoWired
export class CommentCartPage extends YvesPage {
  @inject(REPOSITORIES.CommentCartRepository) private repository: CommentCartRepository;

  protected PAGE_URL = '/cart';

  add = (params: AddParams): void => {
    this.repository.getAddCommentForm().last().find('textarea').clear({ timeout: 10000 });
    this.repository.getAddCommentForm().last().find('textarea').type(params.message);
    this.repository.getAddCommentForm().last().find(this.repository.getAddCommentButtonSelector()).click();
  };

  update = (params: UpdateParams): void => {
    const textarea = this.repository.getCommentTextareaForUpdateByCommentText(params.oldMessage);

    textarea.clear().type(params.newMessage);
    textarea.parent().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  remove = (params: RemoveParams): void => {
    this.repository
      .getCommentTextareaForDeleteByCommentText(params.message)
      .parent()
      .find(this.repository.getRemoveCommentButtonSelector())
      .click();
  };

  updateFirst = (params: UpdateFirstParams): void => {
    const textarea = this.repository.getFirstCommentTextarea();
    textarea.clear().type(params.message);

    this.getCommentThreadListSection().first().find(this.repository.getUpdateCommentButtonSelector()).click();
  };

  removeFirst = (): void => {
    this.getCommentThreadListSection().find(this.repository.getRemoveCommentButtonSelector()).click();
  };

  getCommentThreadListSection = (): Cypress.Chainable => {
    return this.repository.getCommentThreadListSection();
  };
}

interface AddParams {
  message: string;
}

interface UpdateParams {
  oldMessage: string;
  newMessage: string;
}

interface RemoveParams {
  message: string;
}

interface UpdateFirstParams {
  message: string;
}
