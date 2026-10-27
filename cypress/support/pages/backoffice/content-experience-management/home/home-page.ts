import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ContentHomeChecklistStep, ContentHomeGuide, ContentHomeRepository } from './home-repository';

@injectable()
@autoWired
export class ContentHomePage extends BackofficePage {
  @inject(REPOSITORIES.ContentHomeRepository) private repository: ContentHomeRepository;

  protected PAGE_URL = '/content-experience-management/home';

  search = (searchTerm: string): void => {
    this.repository.getSearchInput().clear().type(searchTerm);
    this.repository.getSearchButton().click();
  };

  getSearchResults = (): Cypress.Chainable => this.repository.getSearchResults();

  openSearchResult = (text: string): void => {
    this.repository.getSearchResultLink(text).click();
  };

  getErrorMessage = (): Cypress.Chainable => this.repository.getErrorMessage();

  getSuccessMessage = (): Cypress.Chainable => this.repository.getSuccessMessage();

  getWelcome = (): Cypress.Chainable => this.repository.getWelcome();

  dismissWelcome = (): void => {
    this.repository.getWelcomeDismissButton().click();
  };

  getChecklist = (): Cypress.Chainable => this.repository.getChecklist();

  getChecklistStep = (stepKey: ContentHomeChecklistStep): Cypress.Chainable =>
    this.repository.getChecklistStep(stepKey);

  skipChecklistStep = (stepKey: ContentHomeChecklistStep): void => {
    this.repository.getChecklistSkipButton(stepKey).click();
  };

  getGuideCards = (): Cypress.Chainable => this.repository.getGuideCards();

  startPageGuide = (guideKey: ContentHomeGuide, searchTerm: string): void => {
    this.repository.getGuideSearchInput(guideKey).clear().type(searchTerm);
    this.repository.getGuideStartButton(guideKey).click();
  };

  startCreatePageGuide = (): void => {
    this.repository.getGuideStartButton('create-page').click();
  };

  getDeveloperTools = (): Cypress.Chainable => this.repository.getDeveloperTools();

  openDeveloperTools = (): void => {
    this.repository.getDeveloperToolsSummary().click();
  };

  getDeveloperToolsLinks = (): Cypress.Chainable =>
    this.repository.getDeveloperTools().find(this.repository.getDeveloperToolsLinkSelector());

  getAttention = (): Cypress.Chainable => this.repository.getAttention();
}
