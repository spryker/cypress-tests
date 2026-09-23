import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { CmsBlockCreateRepository } from './cms-block-create-repository';

@injectable()
@autoWired
export class CmsBlockCreatePage extends BackofficePage {
  @inject(CmsBlockCreateRepository) private repository: CmsBlockCreateRepository;

  protected PAGE_URL = '/cms-block-gui/create-block';

  createCmsBlock = (params: CreateParams): void => {
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getSaveButton().click();
  };

  getSuccessMessage = (): Cypress.Chainable => cy.contains(this.repository.getSuccessMessage());
}

interface CreateParams {
  name: string;
}
