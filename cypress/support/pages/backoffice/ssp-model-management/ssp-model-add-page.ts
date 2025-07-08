import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class SspModelAddPage extends BackofficePage {
  protected readonly PAGE_URL = '/self-service-portal/add-model';
  private readonly nameInput = '[name="modelForm[name]"]';
  private readonly codeInput = '[name="modelForm[code]"]';
  private readonly descriptionInput = '[name="modelForm[description]"]';
  private readonly submitButton = 'button[data-qa="submit"]';
  private readonly successMessage = '.alert-success';

  public fillModelForm(model: { name: string; code?: string; description?: string }): void {
    cy.get(this.nameInput).type(model.name);

    if (model.code) {
      cy.get(this.codeInput).type(model.code);
    }

    if (model.description) {
      cy.get(this.descriptionInput).type(model.description);
    }
  }

  public submitForm(): void {
    cy.get(this.submitButton).click();
  }

  public verifySuccessMessage(): void {
    cy.get(this.successMessage).should('be.visible');
  }
}
