import { User } from './shared';

interface MailTemplateFixtures {
  defaultPassword: string;
  /**
   * A mail type from MailTemplateConfig::getBundledMailTypeDefinitionMap() whose html and text parts
   * are editable, registered in spy_mail_template_definition by `console mail-template:scan`.
   */
  editableMailType: string;
  scanCommand: string;
}

export interface MailTemplateManagementStaticFixtures extends MailTemplateFixtures {
  newHtmlBody: string;
}

export interface MailTemplateManagementDynamicFixtures {
  rootUser: User;
}

export interface MailTemplateEditorChipsStaticFixtures extends MailTemplateFixtures {
  chipType: string;
}

export interface MailTemplateEditorChipsDynamicFixtures {
  rootUser: User;
}

export interface MailTemplatePreviewStaticFixtures extends MailTemplateFixtures {
  /** PreviewController::IFRAME_SANDBOX — the only token the preview iframe may carry. */
  expectedIframeSandbox: string;
  forbiddenIframeSandboxToken: string;
}

export interface MailTemplatePreviewDynamicFixtures {
  rootUser: User;
}

export interface MailTemplateTestSendStaticFixtures extends MailTemplateFixtures {
  recipientEmail: string;
}

export interface MailTemplateTestSendDynamicFixtures {
  rootUser: User;
}

export interface MailTemplateAclSourceStaticFixtures extends MailTemplateFixtures {
  restrictedUserPassword: string;
}

export interface MailTemplateAclSourceDynamicFixtures {
  rootUser: User;
  editorWithoutSourceUser: User;
}
