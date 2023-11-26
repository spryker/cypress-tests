export class LoginRepository {
    getLoginEmailInput = () => {
        return cy.get('#loginForm_email');
    }

    getLoginPasswordInput = () => {
        return cy.get('#loginForm_password');
    }

    getLoginForm = () => {
        return cy.get('form[name=loginForm]');
    }
}
