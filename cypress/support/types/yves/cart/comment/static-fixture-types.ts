export interface CartCommentStaticFixtures {
  commentsToAdd: string[];
  commentToModify: string;
  modifiedComment: string;
  commentsToRemove: string;
  customer: Customer;
}

interface Customer {
  password: string;
}
