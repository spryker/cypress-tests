import { YvesPage } from '@pages/yves';
import { SspAssetRepository } from './ssp-asset-repository';
import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class SspAssetListPage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  protected PAGE_URL = '/customer/asset';

  clickCreateAssetButton(): void {
    this.repository.getCreateAssetButton().click();
  }

  getFirstRowReference(): Cypress.Chainable<string> {
    return this.repository.getFirstRowReference();
  }

  openLatestAssetDetailsPage(): void {
    this.repository.getFirstRowViewButton().click();
  }

  assertTableHeaders(expectedHeaders: string[]): void {
    this.repository.getAssetTableHeaders().each(($header, index) => {
      if (index < expectedHeaders.length && expectedHeaders[index]) {
        cy.wrap($header).should('contain.text', expectedHeaders[index]);
      }
    });
  }

  assertTableHasData(): void {
    this.repository.getAssetTableRows().should('have.length.at.least', 1);
  }

  assertAssetNameInTable(assetName: string): Cypress.Chainable<boolean> {
    return this.repository.getAssetNameCells().then($cells => {
      for (let i = 0; i < $cells.length; i++) {
        if ($cells.eq(i).text().trim().includes(assetName)) {
          return true;
        }
      }
      return false;
    });
  }

  assertTableRowContains(rowIndex: number, expectedTexts: Record<string, string>): void {
    if (expectedTexts.reference) {
      this.repository.getAssetReferenceCells().eq(rowIndex).should('contain.text', expectedTexts.reference);
    }

    if (expectedTexts.name) {
      this.repository.getAssetNameCells().eq(rowIndex).should('contain.text', expectedTexts.name);
    }

    if (expectedTexts.serialNumber) {
      this.repository.getAssetSerialNumberCells().eq(rowIndex).should('contain.text', expectedTexts.serialNumber);
    }
  }

  getRowCount(): Cypress.Chainable<number> {
    return this.repository.getAssetTableRows().its('length');
  }
}
