export class MultiCartRepository {
  getCreateCartNameInput = () => {
    return cy.get('#quoteForm_name');
  };

  getCreateCartForm = () => {
    return cy.get('form[name=quoteForm]');
  };
}
