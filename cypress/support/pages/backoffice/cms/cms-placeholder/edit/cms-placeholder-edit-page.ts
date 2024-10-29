import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CmsPlaceholderEditRepository } from './cms-placeholder-edit-repository';

@injectable()
@autoWired
export class CmsPlaceholderEditPage extends BackofficePage {
  @inject(CmsPlaceholderEditRepository) private repository: CmsPlaceholderEditRepository;

  protected PAGE_URL = 'cms-gui/create-glossary/index';

  update = (params: UpdateParams): void => {
    this.repository
      .getTitleBlock()
      .find(this.repository.getAllCollapsedIboxButtonsSelector())
      .each(($button) => {
        cy.wrap($button).click({ force: true });
      });

    this.repository
      .getTitleBlock()
      .find(this.repository.getAllIboxesSelector())
      .each(($ibox) => {
        cy.wrap($ibox)
          .find(this.repository.getLocalizedTextareaSelector())
          .each(($input) => {
            cy.wrap($input).clear({ force: true });
            cy.wrap($input).type(params.cmsPageName, { force: true });
          });
      });

    this.repository.getUpdatePlaceholderButton().click();

    this.repository.getPublishPageButton().click({ force: true });
  };
}

interface UpdateParams {
  cmsPageName: string;
}
