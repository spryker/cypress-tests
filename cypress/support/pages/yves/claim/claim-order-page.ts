import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import {ClaimRepository} from "./claim-repository";

@injectable()
@autoWired
export class ClaimOrderPage extends YvesPage {
    @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

    clickCreateClaimButton(): void
    {
        this.repository.getCreateOrderClaimButton().click();
    }
}
