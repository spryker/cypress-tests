import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import { SspAssetRepository } from './ssp-asset-repository';

@injectable()
@autoWired
export class SspAssetEditPage extends YvesPage {
    @inject(REPOSITORIES.SspAssetRepository) private repository: SspAssetRepository;

    protected PAGE_URL = '/customer/asset/update';

    public editAsset(params: AssetEditParams): void {
        this.repository.getAssetForm().within(() => {
            this.repository.getNameInput().type(params.name);
            this.repository.getSubmitButton().click();
        });
    }

    public getAssetEditedMessage(): string
    {
        return this.repository.getAssetEditedMessage();
    }
}

export interface AssetEditParams {
    name: string;
}
