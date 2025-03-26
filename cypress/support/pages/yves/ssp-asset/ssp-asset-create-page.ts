import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import { SspAssetRepository } from './ssp-asset-repository';

@injectable()
@autoWired
export class SspAssetCreatePage extends YvesPage {
  @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

  protected PAGE_URL = '/customer/asset/create';

  public createAsset(params: AssetCreateParams): void {
    this.repository.getAssetForm().within(() => {
      this.repository.getNameInput().type(params.name);
      if (params.serialNumber) {
          this.repository.getSerialNumberInput().type(params.serialNumber);
      }
        if (params.note) {
            this.repository.getNoteInput().type(params.note);

        }
        if (params.image) {
            this.repository.getImageUploadInput().attachFile(params.image);
        }
      this.repository.getSubmitButton().click();
    });
  }

  public getAssetCreatedMessage(): string {
    return this.repository.getAssetCreatedMessage();
  }
}

export interface AssetCreateParams {
  name: string;
  serialNumber?: string;
  note?: string;
  image?: string;
}
