import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MailTemplateManageRepository } from './mail-template-manage-repository';

@injectable()
@autoWired
export class MailTemplateManagePage extends BackofficePage {
  @inject(MailTemplateManageRepository) private repository: MailTemplateManageRepository;

  protected PAGE_URL = '/mail-template/manage';

  static readonly TAB_CONTENT = 'mail-template-content';

  static readonly TAB_SUBJECT = 'mail-template-subject';

  static readonly TAB_SETTINGS = 'mail-template-settings';

  static readonly TAB_PREVIEW = 'mail-template-preview';

  visitForMailType = (mailType: string): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?mailType=${encodeURIComponent(mailType)}`);
  };

  openTab = (tabId: string): void => {
    this.repository.getTabLink(tabId).click();
  };

  getForm = (): Cypress.Chainable => this.repository.getForm();

  getHtmlBodyTextarea = (): Cypress.Chainable => this.repository.getHtmlBodyTextarea();

  getSubjectInput = (): Cypress.Chainable => this.repository.getSubjectInput();

  getStoreNameSelect = (): Cypress.Chainable => this.repository.getStoreNameSelect();

  getLocaleNameSelect = (): Cypress.Chainable => this.repository.getLocaleNameSelect();

  getTabPane = (tabId: string): Cypress.Chainable => this.repository.getTabPane(tabId);

  getSaveButton = (): Cypress.Chainable => this.repository.getSaveButton();

  getSourcePanel = (): Cypress.Chainable => this.repository.getSourcePanel();

  getPreviewFrame = (): Cypress.Chainable => this.repository.getPreviewFrame();

  getEditorArea = (): Cypress.Chainable => this.repository.getEditorArea();

  getVariableChips = (): Cypress.Chainable => this.repository.getVariableChips();

  /**
   * The WYSIWYG owns the HTML body; typing into the hidden textarea would be overwritten by
   * Summernote on submit, so the contenteditable surface is the only correct write path.
   */
  replaceHtmlBody = (html: string): void => {
    this.repository.getEditorArea().clear();
    this.repository.getEditorArea().type(html, { parseSpecialCharSequences: false });
  };

  insertFirstVariableChip = (): void => {
    this.repository.getVariableDropdownToggle().first().click();
    this.repository.getVariableDropdownItems().first().click();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
