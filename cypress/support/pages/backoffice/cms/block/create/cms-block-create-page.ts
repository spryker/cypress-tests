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

  // The Zed breadcrumb is the <spryker-breadcrumbs> web component; its labels live in
  // the JSON `breadcrumbs` attribute (mirrors the Codeception seeBreadcrumbNavigation,
  // which reads the same attribute and asserts each part's label).
  assertBreadcrumb = (labels: Array<string>): void => {
    labels.forEach((label) => {
      this.repository.getBreadcrumbs().should('have.attr', 'breadcrumbs').and('include', label);
    });
  };

  assertSuccessMessage = (): void => {
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
  };
}

interface CreateParams {
  name: string;
}
