export class Repository {
  getAllItemsCheckbox = () => {
    return cy.get('.js-check-all-items');
  };

  getCreateReturnButton = () => {
    return cy
      .get('form[name=return_create_form]')
      .find('button:contains("Create return")');
  };
}
