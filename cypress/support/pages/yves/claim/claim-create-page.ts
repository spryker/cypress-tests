import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import {ClaimRepository} from "./claim-repository";

@injectable()
@autoWired
export class ClaimCreatePage extends YvesPage {
  @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

  public PAGE_URL = '/customer/claim/create';


  createClaim(params: ClaimParams): void
  {
      this.assertPageLocation();

      cy.get('select[name="claimForm[type_display]"] option').should('have.length', params.availableTypes.length);
      params.availableTypes.forEach((type, index) => {
          cy.get('select[name="claimForm[type_display]"] option').eq(index).should('have.value', type);
      });

        cy.get('form[name="claimForm"] input[name="claimForm[subject]"]').type(params.subject);
        cy.get('form[name="claimForm"] textarea[name="claimForm[description]"]').type(params.description);
        for (let fileName of params.files) {
            cy.get('form[name="claimForm"] input[name="claimForm[files][]"]').attachFile(fileName);
        }

        cy.get('form[name="claimForm"] button[type="submit"]').click();
    }

    getClaimCreatedMessage(): string
    {
        return this.repository.getClaimCreatedMessage();
    }
}

interface ClaimParams {
    subject: string;
    description: string;
    files: string[];
    availableTypes: string[];
}
