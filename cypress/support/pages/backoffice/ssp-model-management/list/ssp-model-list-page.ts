import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspModelListRepository } from './ssp-model-list-repository';

@injectable()
@autoWired
export class SspModelListPage extends BackofficePage {
  @inject(SspModelListRepository) private repository: SspModelListRepository;

  protected readonly PAGE_URL = '/self-service-portal/list-model';

  clickCreateButton(): void {
    cy.get(this.repository.getCreateButtonSelector()).click();
  }

  verifyModelInTable(params: { name?: string; code?: string }): void {
    cy.intercept('GET', '**/self-service-portal/list-model/table*').as('modelTableData');

    cy.wait('@modelTableData').then(() => {
      cy.get(this.repository.getModelTableSelector()).and('contain', params.name);

      if (params.code) {
        cy.get(this.repository.getModelTableSelector()).and('contain', params.code);
      }
    });
  }
}
