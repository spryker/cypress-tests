import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { CmsPageCreateRepository } from './cms-page-create-repository';

@injectable()
@autoWired
export class CmsPageCreatePage extends BackofficePage {
  @inject(CmsPageCreateRepository) private repository: CmsPageCreateRepository;

  protected PAGE_URL = '/cms-gui/create-page';

  create = (params: CreateParams): void => {
    this.repository.getIsSearchableCheckbox().check();

    this.repository
      .getGeneralBlock()
      .find(this.repository.getAllCollapsedIboxButtonsSelector())
      .each(($button) => {
        cy.wrap($button).click({ force: true });
      });

    this.repository
      .getGeneralBlock()
      .find(this.repository.getAllIboxesSelector())
      .each(($ibox) => {
        cy.wrap($ibox)
          .find(this.repository.getLocalizedFieldSelector())
          .each(($field) => {
            cy.wrap($field).as('field');
            cy.get('@field').clear({ force: true });
            cy.get('@field').type(params.cmsPageName, { force: true });
          });
      });

    this.repository.getCreatePageButton().click();
  };
}

interface CreateParams {
  cmsPageName: string;
}
