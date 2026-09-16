export interface BackofficeAssistantDemoStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  contextPageUrl: string;
  contextFormName: string;
  attachmentImagePath: string;
  formFill: {
    agentName: string;
    prompt: string;
    targetFieldName: string;
  };
  orderManagement: {
    agentName: string;
    prompt: string;
  };
  simplePrompt: string;
  unknownConversationReference: string;
  enabledAgents: string[];
  promptRequiredValidationMessage: string;
  attachmentUnsupportedMediaTypeMessage: string;
  attachmentCountExceededMessage: string;
  attachmentMaxCount: number;
  formFillTargetValue: string;
  xssPromptPayload: string;
  stubbedAgentName: string;
  historyEntryName: string;
  unsupportedAttachmentPath: string;
}
