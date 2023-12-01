import { Page } from "../../../page";
import { CommentRepository } from "./comment.repository";

export class CommentPage extends Page {
  PAGE_URL = "/cart";
  repository: CommentRepository;

  constructor() {
    super();
    this.repository = new CommentRepository();
  }

  addComment = (commentMessage: string) => {
    this.repository
      .getAddCommentForm()
      .last()
      .find("textarea")
      .clear()
      .type(commentMessage);
    this.repository
      .getAddCommentForm()
      .last()
      .find('button:contains("Add")')
      .click();
  };

  updateFirstComment = (commentMessage: string) => {
    this.repository
      .getAddCommentForm()
      .first()
      .find("textarea")
      .clear()
      .type(commentMessage);
    this.repository
      .getAddCommentForm()
      .first()
      .find('button:contains("Update")')
      .click();
  };

  removeFirstComment = () => {
    this.repository
      .getAddCommentForm()
      .first()
      .find('button:contains("Remove")')
      .click();
  };

  assertCommentMessage = (commentMessage: string) => {
    this.repository
      .getCommentThreadListSection()
      .contains(commentMessage)
      .should("exist");
  };

  assertEmptyCommentThreadList = () => {
    this.repository.getCommentThreadListSection().should("not.exist");
  };
}
