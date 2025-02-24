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

    public createAsset(params: AssetParams): void {
        this.repository.getAssetForm().within(() => {
            this.repository.getNameInput().type(params.name);
            this.repository.getSubmitButton().click();
        });
    }

    public getAssetCreatedMessage(): string
    {
        return this.repository.getAssetCreatedMessage();
    }
}

export interface AssetParams {
    name: string,
    serialNumber?: string,
    note?: string,
    image?: string,
}
