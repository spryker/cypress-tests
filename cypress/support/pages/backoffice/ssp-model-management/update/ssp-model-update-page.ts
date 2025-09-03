import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SspModelUpdateRepository } from './ssp-model-update-repository';

@injectable()
@autoWired
export class SspModelUpdatePage extends BackofficePage {
  @inject(SspModelUpdateRepository) private repository: SspModelUpdateRepository;

  protected readonly PAGE_URL = '/self-service-portal/update-model';

  public fillSspModelForm(sspModel: { code: string }): void {
    this.repository.getCodeInput().type(sspModel.code);
  }

  public submitForm(): void {
    this.repository.getSubmitButton().click();
  }

  public verifySuccessMessage(): void {
    this.repository.getSuccessMessageContainer().should('be.visible');
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
  }
}
