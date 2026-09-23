import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetListRepository } from './ssp-asset-list-repository';

@injectable()
@autoWired
export class SspAssetListPage extends BackofficePage {
  @inject(SspAssetListRepository) private repository: SspAssetListRepository;

  protected PAGE_URL = '/self-service-portal/list-asset';

  getIdHeader(): Cypress.Chainable {
    return cy.get(this.repository.getIdHeaderSelector());
  }

  getReferenceHeader(): Cypress.Chainable {
    return cy.get(this.repository.getReferenceHeaderSelector());
  }

  getImageHeader(): Cypress.Chainable {
    return cy.get(this.repository.getImageHeaderSelector());
  }

  getNameHeader(): Cypress.Chainable {
    return cy.get(this.repository.getNameHeaderSelector());
  }

  getSerialNumberHeader(): Cypress.Chainable {
    return cy.get(this.repository.getSerialNumberHeaderSelector());
  }

  getStatusHeader(): Cypress.Chainable {
    return cy.get(this.repository.getStatusHeaderSelector());
  }

  getIdColumnValues(): Cypress.Chainable<number[]> {
    return cy.get(this.repository.getIdHeaderSelector()).then(($idHeader) => {
      return cy.get('table.dataTable thead th').then(($headers) => {
        const idIndex = $headers.index($idHeader);

        return cy.get(`table.dataTable tbody tr td:nth-child(${idIndex + 1})`).then(($cells) => {
          return $cells.map((i, el) => parseInt(Cypress.$(el).text().trim(), 10)).get();
        });
      });
    });
  }

  getTableRows(): Cypress.Chainable {
    return cy.get('table.dataTable tbody tr');
  }

  clickCreateButton(): void {
    cy.get(this.repository.getCreateButtonSelector()).click();
  }

  searchAsset(searchTerm: string): void {
    cy.get(this.repository.getSearchInputSelector()).clear();
    cy.get(this.repository.getSearchInputSelector()).type(searchTerm);
  }
}
