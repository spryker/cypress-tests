import { injectable } from 'inversify';
import { autoWired } from '@utils';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class SspModelListPage extends BackofficePage {
  protected readonly PAGE_URL = '/self-service-portal-gui/model';
  protected readonly modelTable = '#model-table';
  protected readonly createButton = '#create-button';
  protected readonly searchInput = '#search-input';
  protected readonly searchButton = '#search-button';
  protected readonly modelRow = '.model-row';

  public verifyListPage(): void {
    cy.get(this.modelTable).should('be.visible');
    cy.get(this.createButton).should('be.visible');
  }

  public clickCreateButton(): void {
    cy.get(this.createButton).click();
  }

  public searchModel(reference: string): void {
    cy.get(this.searchInput).clear();
    cy.get(this.searchInput).type(reference);
    cy.get(this.searchButton).click();
  }

  public modelTableContainsModel(model: { reference: string; name: string; code?: string }): void {
    cy.get(this.modelRow)
      .contains(model.reference)
      .parents(this.modelRow)
      .within(() => {
        cy.contains(model.name).should('be.visible');
        if (model.code) {
          cy.contains(model.code).should('be.visible');
        }
      });
  }
}
