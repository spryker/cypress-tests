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

  searchAsset(searchTerm: string): void {
    cy.get(this.repository.getSearchInputSelector()).clear();
    cy.get(this.repository.getSearchInputSelector()).type(searchTerm);
  }

  assetTableContainsAsset(params: {
      reference: string,
      name: string,
      status: string,
      serialNumber: string,
      statuses: Status[],
  }): void {
      cy.intercept('GET', '**/ssp-asset-management/index/table*').as('assetTableData');

      cy.wait('@assetTableData').then(() => {

      let displayStatus = params.status;

      if (Array.isArray(params.statuses)) {
          const matchingStatus = params.statuses.find(
              (statusObj) => statusObj.key === params.status
          );

          if (matchingStatus && matchingStatus.value) {
              displayStatus = matchingStatus.value;
          }
      }

      cy.get('table.dataTable tbody tr')
          .should('contain', params.reference)
          .and('contain', params.name)
          .and('contain', displayStatus)
          .and('contain', params.serialNumber);

      });
  }
}


interface Status{
    key: string;
    value: string;
}
