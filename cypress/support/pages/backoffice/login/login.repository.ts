export class LoginRepository {
  getEmailInput = () => {
    return cy.get("#auth_username");
  };
  getPasswordInput = () => {
    return cy.get("#auth_password");
  };
  getSubmitButton = () => {
    return cy.get(".btn");
  };
}