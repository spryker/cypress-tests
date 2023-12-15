import { Repository } from '../repository';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class SuiteRepository implements Repository {
  getLoginEmailInput = (): Cypress.Chainable => {
    return cy.get('#loginForm_email');
  };

  getLoginPasswordInput = (): Cypress.Chainable => {
    return cy.get('#loginForm_password');
  };

  getLoginForm = (): Cypress.Chainable => {
    return cy.get('form[name=loginForm]');
  };

  getRegisterSalutationSelect = (): Cypress.Chainable => {
    return cy.get('#registerForm_salutation');
  };

  getRegisterFirstNameInput = (): Cypress.Chainable => {
    return cy.get('#registerForm_first_name');
  };

  getRegisterLastNameInput = (): Cypress.Chainable => {
    return cy.get('#registerForm_last_name');
  };

  getRegisterEmailInput = (): Cypress.Chainable => {
    return cy.get('#registerForm_email');
  };

  getRegisterPasswordInput = (): Cypress.Chainable => {
    return cy.get('#registerForm_password_pass');
  };

  getRegisterConfirmPasswordInput = (): Cypress.Chainable => {
    return cy.get('#registerForm_password_confirm');
  };

  getRegisterAcceptTermsCheckbox = (): Cypress.Chainable => {
    return cy.get('#registerForm_accept_terms');
  };

  getRegisterForm = (): Cypress.Chainable => {
    return cy.get('form[name=registerForm]');
  };
}
