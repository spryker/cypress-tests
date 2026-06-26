export interface BackofficeAssistantRepository {
  getEnableToggleSelector(): string;
  getSaveButtonSelector(): string;
  getWidgetToggleSelector(): string;
  getWidgetPanelSelector(): string;
  getWidgetAgentSelectSelector(): string;
  getWidgetInputSelector(): string;
  getWidgetSendSelector(): string;
  getWidgetHistoryButtonSelector(): string;
  getWidgetNewChatSelector(): string;
  getWidgetAttachSelector(): string;
}
