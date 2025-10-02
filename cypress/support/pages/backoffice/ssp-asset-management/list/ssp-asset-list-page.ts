import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetListRepository } from './ssp-asset-list-repository';

@injectable()
@autoWired
export class SspAssetListPage extends BackofficePage {
  @inject(SspAssetListRepository) private repository: SspAssetListRepository;

  protected PAGE_URL = '/self-service-portal/list-asset';

  verifyListPage(): void {
    cy.get(this.repository.getIdHeaderSelector()).should('exist');
    cy.get(this.repository.getReferenceHeaderSelector()).should('exist');
    cy.get(this.repository.getImageHeaderSelector()).should('exist');
    cy.get(this.repository.getNameHeaderSelector()).should('exist');
    cy.get(this.repository.getSerialNumberHeaderSelector()).should('exist');
    cy.get(this.repository.getStatusHeaderSelector()).should('exist');

    this.verifyIdColumnSortedDesc();
  }

  verifyIdColumnSortedDesc(): void {
    cy.get(this.repository.getIdHeaderSelector()).then(($idHeader) => {
      cy.get('table.dataTable thead th').then(($headers) => {
        const idIndex = $headers.index($idHeader);

        cy.get(`table.dataTable tbody tr td:nth-child(${idIndex + 1})`).then(($cells) => {
          const ids = $cells.map((i, el) => parseInt(Cypress.$(el).text().trim(), 10)).get();
          const sortedIds = [...ids].sort((a, b) => b - a);
          expect(ids).to.deep.equal(sortedIds, 'ID column should be sorted in descending order');
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
    reference: string;
    name: string;
    status: string;
    serialNumber: string;
    statuses: Status[];
  }): void {
    cy.intercept('GET', '**/self-service-portal/list-asset/table*').as('assetTableData');

    cy.wait('@assetTableData').then(() => {
      let displayStatus = params.status;

      if (Array.isArray(params.statuses)) {
        const matchingStatus = params.statuses.find((statusObj) => statusObj.key === params.status);

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

interface Status {
  key: string;
  value: string;
}
