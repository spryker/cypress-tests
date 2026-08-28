import { autoWired } from '@utils';
import { injectable } from 'inversify';

/**
 * Selectors mirror Spryker\Zed\MailTemplate\Communication\Presentation\Preview\index.twig, whose
 * test-send form is rendered by `form_start(mailTemplateTestSendForm)` — the CSRF token comes with it.
 */
@injectable()
@autoWired
export class MailTemplatePreviewRepository {
  getPreviewFrame = (): Cypress.Chainable => cy.get('iframe.js-mail-template-preview-frame');
  getTemplatePartLink = (templatePart: string): Cypress.Chainable =>
    cy.get(`.nav-pills a[href*="templatePart=${templatePart}"]`);

  getTestSendForm = (): Cypress.Chainable => cy.get('form.js-mail-template-test-send-form');
  // The recipient is a Symfony form row on MailTemplateTestSendForm, not a hand-written input:
  // the id is owned by the form's block prefix, so the data-qa hook is the stable selector.
  getRecipientEmailInput = (): Cypress.Chainable => cy.get('[data-qa="mail-template-recipient-email"]');
  getTestSendButton = (): Cypress.Chainable => cy.get('button.js-mail-template-test-send');
}
