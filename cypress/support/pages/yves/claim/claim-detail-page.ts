import {autoWired, REPOSITORIES} from '@utils';
import {inject, injectable} from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import {ClaimRepository} from "./claim-repository";

@injectable()
@autoWired
export class ClaimDetailPage extends YvesPage {
    @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

    public PAGE_URL = '/customer/claim/detail';

    clickCancelClaimButton(): void
    {
        this.getCancelClaimButton().click();
    }

    getCancelClaimButton(): Cypress.Chainable
    {
        return this.repository.getCancelClaimButton();
    }

    getPendingClaimStatusSelector(): string
    {
        return this.repository.getPendingClaimStatusSelector();
    }
}
