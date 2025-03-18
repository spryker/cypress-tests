import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspAssetRepository } from './ssp-asset-repository';

@injectable()
@autoWired
export class SspAssetDetailPage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  public PAGE_URL = '/customer/asset/details';

  assertAssetDetails(details: SspAssetDetails): void {
    if (details.reference) {
      cy.contains(this.repository.getAssetDetailsReference(details.reference)).should('exist');
    }

    if (details.name) {
      this.repository.getAssetDetailsTitle().should('contain', details.name);
    }

    if (details.serialNumber) {
      cy.contains(this.repository.getAssetDetailsSerialNumber(details.serialNumber)).should('exist');
    }

    if (details.note) {
      cy.contains(this.repository.getAssetDetailsNote(details.note)).should('exist');
    }
  }

  clickEditButton(): void {
    this.repository.getEditAssetButton().click();
  }

  clickCreateClaimButton(): void {
    this.repository.getCreateClaimButton().click();
  }
}

export interface SspAssetDetails {
  reference?: string;
  name: string;
  serialNumber?: string;
  note?: string;
}
