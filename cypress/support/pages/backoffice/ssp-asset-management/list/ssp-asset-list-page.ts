import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetListRepository } from './ssp-asset-list-repository';

@injectable()
@autoWired
export class SspAssetListPage extends BackofficePage {
  @inject(SspAssetListRepository) private repository: SspAssetListRepository;

  protected PAGE_URL = '/ssp-asset-management';

  verifyListPage(): void {
    cy.get(this.repository.getReferenceHeaderSelector()).should('exist');
    cy.get(this.repository.getImageHeaderSelector()).should('exist');
    cy.get(this.repository.getNameHeaderSelector()).should('exist');
    cy.get(this.repository.getSerialNumberHeaderSelector()).should('exist');
    cy.get(this.repository.getStatusHeaderSelector()).should('exist');

    this.verifyReferenceColumnSortedDesc();
  }

  verifyReferenceColumnSortedDesc(): void {
    cy.get(this.repository.getReferenceHeaderSelector()).then(($referenceHeader) => {
      cy.get('table.dataTable thead th').then(($headers) => {
        const referenceIndex = $headers.index($referenceHeader);

        cy.get(`table.dataTable tbody tr td:nth-child(${referenceIndex + 1})`).then(($cells) => {
          const references = $cells.map((i, el) => Cypress.$(el).text().trim()).get();
          const sortedReferences = [...references].sort((a, b) => b.localeCompare(a));
          expect(references).to.deep.equal(sortedReferences, 'Reference column should be sorted in descending order');
        });
      });
    });
  }

  clickCreateButton(): void {
    cy.get(this.repository.getCreateButtonSelector()).click();
  }

  clickViewButton(): void {
    cy.get(this.repository.getViewButtonSelector()).first().click();
  }

  clickEditButton(): void {
    cy.get(this.repository.getEditButtonSelector()).first().click();
  }

  filterByStatus(status: string): void {
    cy.get(this.repository.getStatusFilterSelector()).select(status);
    cy.get(this.repository.getApplyFilterButtonSelector()).click();
  }

  searchAsset(searchTerm: string): void {
    cy.get(this.repository.getSearchInputSelector()).clear()
    cy.get(this.repository.getSearchInputSelector()).type(searchTerm);
  }
}
