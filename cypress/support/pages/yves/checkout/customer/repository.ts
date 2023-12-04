export class Repository {
  getGuestRadioButton = () => {
    return cy.get(
      '[data-qa="component toggler-radio checkoutProceedAs guest"]'
    );
  };

  getGuestFirstNameField = () => {
    return cy.get('#guestForm_customer_first_name');
  };

  getGuestLastNameField = () => {
    return cy.get('#guestForm_customer_last_name');
  };

  getGuestEmailField = () => {
    return cy.get('#guestForm_customer_email');
  };

  getGuestTermsCheckbox = () => {
    return cy.get(
      '[data-qa="component checkbox guestForm[customer][accept_terms] guestForm_customer_accept_terms"]'
    );
  };

  getGuestSubmitButton = () => {
    return cy.contains('button', 'Submit');
  };
}
