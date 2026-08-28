import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MailTemplatePreviewRepository } from './mail-template-preview-repository';

@injectable()
@autoWired
export class MailTemplatePreviewPage extends BackofficePage {
  @inject(MailTemplatePreviewRepository) private repository: MailTemplatePreviewRepository;

  protected PAGE_URL = '/mail-template/preview';

  visitForMailType = (mailType: string): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?mailType=${encodeURIComponent(mailType)}`);
  };

  getPreviewFrame = (): Cypress.Chainable => this.repository.getPreviewFrame();

  getTemplatePartLink = (templatePart: string): Cypress.Chainable => this.repository.getTemplatePartLink(templatePart);

  getTestSendForm = (): Cypress.Chainable => this.repository.getTestSendForm();

  getRecipientEmailInput = (): Cypress.Chainable => this.repository.getRecipientEmailInput();

  sendTestMail = (recipientEmail: string): void => {
    this.repository.getRecipientEmailInput().clear();
    this.repository.getRecipientEmailInput().type(recipientEmail);
    this.repository.getTestSendButton().click();
  };
}
