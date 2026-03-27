import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { ConfigurationRepository } from './configuration-repository';

@injectable()
@autoWired
export class ConfigurationPage extends BackofficePage {
  @inject(ConfigurationRepository) private repository: ConfigurationRepository;

  protected PAGE_URL = '/configuration/manage';

  visitLogosTab = (): void => {
    cy.visitBackoffice(this.PAGE_URL + '?tab=logos');
  };

  visitStorefrontTab = (): void => {
    cy.visitBackoffice(this.PAGE_URL + '?tab=storefront');
  };

  visitBackofficeTab = (): void => {
    cy.visitBackoffice(this.PAGE_URL + '?tab=backoffice');
  };

  visitMerchantPortalTab = (): void => {
    cy.visitBackoffice(this.PAGE_URL + '?tab=merchant_portal');
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
    cy.wait('@logoUpload').its('response.statusCode').should('eq', 200);
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

  private verifyLogoUploaded = (containerSelector: string): void => {
    cy.get(containerSelector).find(this.repository.getUploadTriggerSelector()).should('contain.text', 'Change File');
    cy.get(containerSelector).find(this.repository.getLogoHiddenValueInputSelector()).should('not.have.value', '');
  };

  verifyStorefrontLogoUploaded = (): void => {
    this.verifyLogoUploaded(this.repository.getStorefrontLogoContainerSelector());
  };

  verifyBackofficeLogoUploaded = (): void => {
    this.verifyLogoUploaded(this.repository.getBackofficeLogoContainerSelector());
  };

  verifyMerchantPortalLogoUploaded = (): void => {
    this.verifyLogoUploaded(this.repository.getMerchantPortalLogoContainerSelector());
  };
}
