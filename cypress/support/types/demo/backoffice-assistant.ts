export interface BackofficeAssistantDemoStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  contextFormName: string;
  attachmentImagePath: string;
  attachmentImageName: string;
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
  stubbedConversationReference: string;
  enabledAgents: string[];
  invalidPayloadMessage: string;
  attachmentUnsupportedMediaTypeMessage: string;
  attachmentCountExceededMessage: string;
  attachmentMaxCount: number;
  formFillTargetValue: string;
  xssPromptPayload: string;
  stubbedAgentName: string;
  stubbedToolName: string;
  stubbedToolLabel: string;
  historyEntryName: string;
  unsupportedAttachmentPath: string;
}
