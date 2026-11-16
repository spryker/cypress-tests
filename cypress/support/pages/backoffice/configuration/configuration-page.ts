import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ConfigurationRepository } from './configuration-repository';

@injectable()
@autoWired
export class ConfigurationPage extends BackofficePage {
  @inject(ConfigurationRepository) private repository: ConfigurationRepository;

  protected PAGE_URL = '/configuration/manage';

  protected THEME_FEATURE = 'theme';

  protected AI_COMMERCE_FEATURE = 'ai_commerce';

  protected SCOPE_GLOBAL = 'global';

  visitAiCommerceTab = (tabKey: string): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${this.AI_COMMERCE_FEATURE}&tab=${tabKey}`);
  };

  selectRadioOption = (settingKey: string, value: string): void => {
    cy.get(this.repository.getRadioOptionSelector(settingKey, value)).check({ force: true });
  };

  getSelectSetting = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSelectSettingSelector(settingKey));

  getSelectableOptions = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSelectSettingSelector(settingKey)).find(this.repository.getSelectableOptionSelector());

  selectOption = (settingKey: string, value: string): void => {
    cy.get(this.repository.getSelectSettingSelector(settingKey)).select(value);
  };

  saveConfigurationAndWaitForResponse = (): void => {
    cy.intercept('POST', `**${this.repository.getSaveUrl()}`).as('saveConfiguration');
    this.saveConfiguration();
    cy.wait('@saveConfiguration');
  };

  requestSaveConfigurationValue = (params: {
    settingKey: string;
    value: string;
  }): Cypress.Chainable<Cypress.Response<SaveConfigurationResponse>> =>
    cy.request<SaveConfigurationResponse>({
      method: 'POST',
      url: `${Cypress.env().backofficeUrl}${this.repository.getSaveUrl()}`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: { changes: [{ key: params.settingKey, value: params.value, scope: this.SCOPE_GLOBAL }] },
      failOnStatusCode: false,
    });

  requestUseDefaultConfigurationValue = (
    settingKey: string
  ): Cypress.Chainable<Cypress.Response<SaveConfigurationResponse>> =>
    cy.request<SaveConfigurationResponse>({
      method: 'POST',
      url: `${Cypress.env().backofficeUrl}${this.repository.getSaveUrl()}`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: { changes: [{ key: settingKey, value: null, use_default: true, scope: this.SCOPE_GLOBAL }] },
    });

  visitLogosTab = (): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${this.THEME_FEATURE}&tab=logos`);
  };

  visitStorefrontTab = (): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${this.THEME_FEATURE}&tab=storefront`);
  };

  visitBackofficeTab = (): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${this.THEME_FEATURE}&tab=backoffice`);
  };

  visitMerchantPortalTab = (): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?feature=${this.THEME_FEATURE}&tab=merchant_portal`);
  };

  getScopeSelector = (): Cypress.Chainable => cy.get(this.repository.getScopeSelectorSelector());

  getSaveButton = (): Cypress.Chainable => cy.get(this.repository.getSaveButtonSelector());

  getResetButton = (): Cypress.Chainable => cy.get(this.repository.getResetButtonSelector());

  getBackofficeLogoUploadButton = (): Cypress.Chainable =>
    cy.get(this.repository.getBackofficeLogoContainerSelector()).find(this.repository.getUploadTriggerSelector());

  getMerchantPortalLogoUploadButton = (): Cypress.Chainable =>
    cy.get(this.repository.getMerchantPortalLogoContainerSelector()).find(this.repository.getUploadTriggerSelector());

  getStorefrontLogoUploadButton = (): Cypress.Chainable =>
    cy.get(this.repository.getStorefrontLogoContainerSelector()).find(this.repository.getUploadTriggerSelector());

  getThemeMainColor = (): Cypress.Chainable => cy.get(this.repository.getThemeMainColorSelector());

  getThemeAltColor = (): Cypress.Chainable => cy.get(this.repository.getThemeAltColorSelector());

  getCustomCss = (): Cypress.Chainable => cy.get(this.repository.getCustomCssSelector());

  getBackofficeColor = (): Cypress.Chainable => cy.get(this.repository.getBackofficeColorSelector());

  getBackofficeSidenavColor = (): Cypress.Chainable => cy.get(this.repository.getBackofficeSidenavColorSelector());

  getBackofficeSidenavTextColor = (): Cypress.Chainable =>
    cy.get(this.repository.getBackofficeSidenavTextColorSelector());

  getMerchantPortalColor = (): Cypress.Chainable => cy.get(this.repository.getMerchantPortalColorSelector());

  setThemeMainColor = (color: string): void => {
    cy.get(this.repository.getThemeMainColorSelector()).invoke('val', color);
    cy.get(this.repository.getThemeMainColorSelector()).trigger('input');
    cy.get(this.repository.getThemeMainColorSelector()).trigger('change');
  };

  setBackofficeColor = (color: string): void => {
    cy.get(this.repository.getBackofficeColorSelector()).invoke('val', color);
    cy.get(this.repository.getBackofficeColorSelector()).trigger('input');
    cy.get(this.repository.getBackofficeColorSelector()).trigger('change');
  };

  setBackofficeSidenavColor = (color: string): void => {
    cy.get(this.repository.getBackofficeSidenavColorSelector()).invoke('val', color);
    cy.get(this.repository.getBackofficeSidenavColorSelector()).trigger('input');
    cy.get(this.repository.getBackofficeSidenavColorSelector()).trigger('change');
  };

  setBackofficeSidenavTextColor = (color: string): void => {
    cy.get(this.repository.getBackofficeSidenavTextColorSelector()).invoke('val', color);
    cy.get(this.repository.getBackofficeSidenavTextColorSelector()).trigger('input');
    cy.get(this.repository.getBackofficeSidenavTextColorSelector()).trigger('change');
  };

  setMerchantPortalColor = (color: string): void => {
    cy.get(this.repository.getMerchantPortalColorSelector()).invoke('val', color);
    cy.get(this.repository.getMerchantPortalColorSelector()).trigger('input');
    cy.get(this.repository.getMerchantPortalColorSelector()).trigger('change');
  };

  saveConfiguration = (): void => {
    cy.get(this.repository.getSaveButtonSelector()).click({ force: true });
  };

  private uploadLogoToContainer = (containerSelector: string, filePath: string): void => {
    cy.intercept('POST', this.repository.getFileUploadUrl()).as('logoUpload');
    cy.get(containerSelector).find(this.repository.getUploadTriggerSelector()).click({ force: true });
    cy.get(containerSelector).find(this.repository.getModalFileInputSelector()).selectFile(filePath, { force: true });
    cy.get(containerSelector).find(this.repository.getModalUploadSubmitSelector()).click();
  };

  uploadStorefrontLogo = (filePath: string): void => {
    this.uploadLogoToContainer(this.repository.getStorefrontLogoContainerSelector(), filePath);
  };

  uploadBackofficeLogo = (filePath: string): void => {
    this.uploadLogoToContainer(this.repository.getBackofficeLogoContainerSelector(), filePath);
  };

  uploadMerchantPortalLogo = (filePath: string): void => {
    this.uploadLogoToContainer(this.repository.getMerchantPortalLogoContainerSelector(), filePath);
  };

  getStorefrontLogoHiddenValueInput = (): Cypress.Chainable =>
    cy
      .get(this.repository.getStorefrontLogoContainerSelector())
      .find(this.repository.getLogoHiddenValueInputSelector());

  getBackofficeLogoHiddenValueInput = (): Cypress.Chainable =>
    cy
      .get(this.repository.getBackofficeLogoContainerSelector())
      .find(this.repository.getLogoHiddenValueInputSelector());

  getMerchantPortalLogoHiddenValueInput = (): Cypress.Chainable =>
    cy
      .get(this.repository.getMerchantPortalLogoContainerSelector())
      .find(this.repository.getLogoHiddenValueInputSelector());

  resetChanges = (): void => {
    cy.on('window:confirm', (): boolean => true);
    cy.get(this.repository.getResetButtonSelector()).click({ force: true });
  };

  searchSettings = (term: string): void => {
    cy.get(this.repository.getConfigSearchSelector()).clear();
    cy.get(this.repository.getConfigSearchSelector()).type(term);
  };

  clickUseDefaultLink = (settingKey: string): void => {
    cy.get(this.repository.getSettingRowSelector(settingKey))
      .find(this.repository.getUseDefaultLinkSelector())
      .click({ force: true });
  };

  getUseDefaultLink = (settingKey: string): Cypress.Chainable =>
    cy.get(this.repository.getSettingRowSelector(settingKey)).find(this.repository.getUseDefaultLinkSelector());

  clickNavTab = (tabKey: string): void => {
    cy.get(this.repository.getNavTabSelector(tabKey)).click({ force: true });
  };

  getNavTab = (tabKey: string): Cypress.Chainable => cy.get(this.repository.getNavTabSelector(tabKey));

  getSaveBar = (): Cypress.Chainable => cy.get(this.repository.getSaveBarSelector());

  getChangesCount = (): Cypress.Chainable => cy.get(this.repository.getChangesCountSelector());

  getSettingRow = (settingKey: string): Cypress.Chainable => cy.get(this.repository.getSettingRowSelector(settingKey));
}

interface SaveConfigurationResponse {
  success: boolean;
  count: number;
  errors: Record<string, string>;
}
