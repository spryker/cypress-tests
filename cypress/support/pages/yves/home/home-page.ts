import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { HomeRepository } from './home-repository';

@injectable()
@autoWired
export class HomePage extends YvesPage {
  @inject(REPOSITORIES.HomeRepository) private repository: HomeRepository;

  protected PAGE_URL = '/';

  waitTillStoreAvailable = (store: string): void => {
    cy.reloadUntilFound(
      this.PAGE_URL,
      this.repository.getStoreSelectorOption(store),
      this.repository.getStoreSelectorHeader(),
      25,
      5000
    );
  };

  selectStore = (store: string): void => {
    // Cypress does not fire the 'change' event when the option is already selected,
    // so window.location never gets set. Read the store URL from the option value directly.
    cy.get(this.repository.getStoreSelectorOption(store))
      .invoke('val')
      .then((storeUrl) => {
        cy.visit(storeUrl as string);
      });
    cy.url().should('include', store);
  };

  navigateToNewPage(newPageLinkText: string): void {
    this.repository.getNavigationNewLink(newPageLinkText).click({ force: true });
  }

  getLanguageSwitcher(): Cypress.Chainable {
    return this.repository.getLanguageSwitcher();
  }

  getLogo(): Cypress.Chainable {
    return this.repository.getLogo();
  }

  getLogoImage(): Cypress.Chainable {
    return this.repository.getLogoImage();
  }
}
