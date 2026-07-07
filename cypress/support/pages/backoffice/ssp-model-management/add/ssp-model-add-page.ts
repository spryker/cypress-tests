import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SspModelAddRepository } from './ssp-model-add-repository';

@injectable()
@autoWired
export class SspModelAddPage extends BackofficePage {
  @inject(SspModelAddRepository) private repository: SspModelAddRepository;

  protected readonly PAGE_URL = '/self-service-portal/add-model';

  public fillSspModelForm(sspModel: { name: string; code?: string; image?: string }): void {
    this.repository.getNameInput().type(sspModel.name);

    if (sspModel.code) {
      this.repository.getCodeInput().type(sspModel.code);
    }

    if (sspModel.image) {
      this.repository.getImageUploadInput().attachFile(sspModel.image);
    }
  }

  public submitForm(): void {
    this.repository.getSubmitButton().click();
  }

  public getSuccessMessageContainer(): Cypress.Chainable {
    return this.repository.getSuccessMessageContainer();
  }

  public getSuccessMessageText(): Cypress.Chainable {
    return cy.contains(this.repository.getSuccessMessage());
  }

  public getModelImage(): Cypress.Chainable {
    return this.repository.getModelImage();
  }
}
