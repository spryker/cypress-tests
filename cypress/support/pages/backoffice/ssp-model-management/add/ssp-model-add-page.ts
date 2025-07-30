import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SspModelAddRepository } from './ssp-model-add-repository';

@injectable()
@autoWired
export class SspModelAddPage extends BackofficePage {
  @inject(SspModelAddRepository) private repository: SspModelAddRepository;

  protected readonly PAGE_URL = '/self-service-portal/add-model';

  public fillModelForm(model: { name: string; code?: string; image?: string }): void {
    this.repository.getNameInput().type(model.name);

    if (model.code) {
      this.repository.getCodeInput().type(model.code);
    }

    if (model.image) {
      this.repository.getImageUploadInput().attachFile(model.image);
    }
  }

  public submitForm(): void {
    this.repository.getSubmitButton().click();
  }

  public verifySuccessMessage(): void {
    this.repository.getSuccessMessageContainer().should('be.visible');
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
  }
}
