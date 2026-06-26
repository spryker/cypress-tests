export interface AiConfigurationRepository {
  getCardTitleSelector(): string;
  getFeatureNavSelector(feature: string): string;
  getTabNavSelector(feature: string, tab: string): string;
  getSaveButtonSelector(): string;
  getSettingRowSelector(settingKey: string): string;
  getSettingInputSelector(settingKey: string): string;
  getJsonEditorSelector(settingKey: string): string;
  getRadioOptionSelector(settingKey: string): string;
}
