import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PageBuilderRepository } from './page-builder-repository';

@injectable()
@autoWired
export class PageBuilderPage extends BackofficePage {
  @inject(PageBuilderRepository) private repository: PageBuilderRepository;

  protected PAGE_URL = '/content-experience-management/page-builder';

  getPlaceholder = (placeholder: string): Cypress.Chainable => this.repository.getPlaceholder(placeholder);

  addText = (placeholder: string, text: string): void => {
    this.repository.getPlaceholder(placeholder).find(this.repository.getAddTextButtonSelector()).click();
    this.repository.getPlaceholder(placeholder).find(this.repository.getRichTextSelector()).type(text);
  };

  // The Back Office top bar is fixed; scrolling the library controls to the centre keeps them out from under it.
  searchLibrary = (searchTerm: string, componentType = ''): void => {
    this.repository.getLibraryTypeSelect().select(componentType);
    this.repository
      .getLibrarySearchInput()
      .clear({ scrollBehavior: 'center' })
      .type(searchTerm, { scrollBehavior: 'center' });
  };

  addLibraryComponent = (componentText: string, targetText: string): void => {
    this.repository.getLibraryCard(componentText).within(() => {
      cy.get(this.repository.getLibraryTargetSelectSelector()).select(targetText);
      cy.get(this.repository.getLibraryAddButtonSelector()).click();
    });
  };

  openBannerDialog = (): void => {
    this.repository.getCreateBannerButton().click();
    this.repository.getBannerInput('name').should('have.focus');
  };

  submitBannerDialog = (): void => {
    this.repository.getBannerSubmitButton().click();
  };

  getBannerFieldError = (field: string): Cypress.Chainable => this.repository.getBannerFieldError(field);

  createBanner = (params: CreateBannerParams): void => {
    this.openBannerDialog();
    this.repository.getBannerInput('name').type(params.name);
    this.repository.getBannerInput('title').type(params.title);
    this.repository.getBannerInput('subtitle').type(params.subtitle);
    this.repository.getBannerInput('imageUrl').type(params.imageUrl);
    this.repository.getBannerInput('clickUrl').type(params.clickUrl);
    this.repository.getBannerInput('altText').type(params.altText);
    this.submitBannerDialog();
    this.repository.getBannerModal().should('not.be.visible');
  };

  copyToOtherLocales = (placeholder: string): void => {
    this.repository.getPlaceholder(placeholder).find(this.repository.getCopyLocaleButtonSelector()).click();
  };

  switchLocale = (localeName: string): void => {
    this.repository.getLocaleSelect().select(localeName);
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };

  openPublishModal = (): void => {
    this.repository.getPublishButton().should('not.be.disabled').click();
  };

  getPublishModal = (): Cypress.Chainable => this.repository.getPublishModal();

  getPublishImpact = (): Cypress.Chainable => this.repository.getPublishImpact();

  confirmPublish = (): void => {
    this.repository.getPublishConfirmButton().click();
  };

  publish = (): void => {
    this.openPublishModal();
    this.confirmPublish();
  };

  editFirstSection = (placeholder: string, text: string): void => {
    this.repository.getPlaceholder(placeholder).find(this.repository.getSectionEditButtonSelector()).first().click();
    this.repository.getPlaceholder(placeholder).find(this.repository.getRichTextSelector()).type(`{selectall}${text}`);
  };

  getGuide = (): Cypress.Chainable => this.repository.getGuide();

  getGuideSteps = (): Cypress.Chainable => this.repository.getGuideSteps();

  getGuideStep = (stepId: string): Cypress.Chainable => this.repository.getGuideStep(stepId);

  openBannerUsage = (bannerName: string): void => {
    this.repository
      .getLibraryCard(bannerName)
      .find(this.repository.getLibraryEditBannerButtonSelector())
      .scrollIntoView({ offset: { top: -200, left: 0 } })
      .click();
  };

  getBannerUsageModal = (): Cypress.Chainable => this.repository.getBannerUsageModal();

  getBannerUsage = (): Cypress.Chainable => this.repository.getBannerUsage();

  cancelBannerUsage = (): void => {
    this.repository.getBannerUsageCancelButton().click();
  };

  getRoot = (): Cypress.Chainable => this.repository.getRoot();

  getStatus = (): Cypress.Chainable => this.repository.getStatus();

  getStatusLine = (): Cypress.Chainable => this.repository.getStatusLine();

  getErrors = (): Cypress.Chainable => this.repository.getErrors();

  getSections = (placeholder: string): Cypress.Chainable =>
    this.repository.getPlaceholder(placeholder).find(this.repository.getSectionSelector());

  getSlotBlocks = (slotName: string): Cypress.Chainable =>
    this.repository.getSlot(slotName).find(this.repository.getSlotBlockSelector());

  getLibraryCard = (text: string): Cypress.Chainable => this.repository.getLibraryCard(text);

  openPreviewPane = (): void => {
    this.repository.getPreviewPaneToggle().click();
    this.repository.getPreviewPane().should('be.visible');
  };

  choosePreviewDevice = (device: 'phone' | 'tablet' | 'desktop'): void => {
    this.repository.getPreviewDeviceButton(device).click();
  };

  resizePreviewWithKey = (key: string): void => {
    this.repository.getPreviewResizer().focus().type(key);
  };

  resetPreviewWidth = (): void => {
    this.repository.getPreviewResizer().dblclick();
  };

  getPreviewWidth = (): Cypress.Chainable => this.repository.getPreviewWidth();

  getPreviewDeviceButton = (device: string): Cypress.Chainable => this.repository.getPreviewDeviceButton(device);
}

interface CreateBannerParams {
  name: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  clickUrl: string;
  altText: string;
}
