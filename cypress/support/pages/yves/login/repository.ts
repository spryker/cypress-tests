export class Repository {
  getLoginEmailInput = () => {
    return cy.get('#loginForm_email');
  };

  getLoginPasswordInput = () => {
    return cy.get('#loginForm_password');
  };

  getLoginForm = () => {
    return cy.get('form[name=loginForm]');
  };

  getRegisterSalutationSelect = () => {
    return cy.get('#registerForm_salutation');
  };

  getRegisterFirstNameInput = () => {
    return cy.get('#registerForm_first_name');
  };

  getRegisterLastNameInput = () => {
    return cy.get('#registerForm_last_name');
  };

  getRegisterEmailInput = () => {
    return cy.get('#registerForm_email');
  };

  getRegisterPasswordInput = () => {
    return cy.get('#registerForm_password_pass');
  };

  getRegisterConfirmPasswordInput = () => {
    return cy.get('#registerForm_password_confirm');
  };

  getRegisterAcceptTermsCheckbox = () => {
    return cy.get('#registerForm_accept_terms');
  };

  getRegisterForm = () => {
    return cy.get('form[name=registerForm]');
  };
}
