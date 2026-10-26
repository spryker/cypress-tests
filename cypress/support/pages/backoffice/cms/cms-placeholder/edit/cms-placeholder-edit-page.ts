import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CmsPlaceholderEditRepository } from './cms-placeholder-edit-repository';

@injectable()
@autoWired
export class CmsPlaceholderEditPage extends BackofficePage {
  @inject(CmsPlaceholderEditRepository) private repository: CmsPlaceholderEditRepository;

  protected PAGE_URL = '/cms-gui/create-glossary/index';

  update = (params: UpdateParams): void => {
    this.fillLocalizedPlaceholder(() => this.repository.getTitleBlock(), params.cmsPageName);
    this.saveAndPublish();
  };

  updateTitleAndContent = (params: UpdateTitleAndContentParams): void => {
    this.fillLocalizedPlaceholder(() => this.repository.getTitleBlock(), params.title);

    // The content placeholder sits on a second tab whose fields stay inert until it is opened.
    this.repository.getTabLink('content-content').click();
    this.fillLocalizedPlaceholder(() => this.repository.getContentBlock(), params.content);

    this.saveAndPublish();
  };

  // Each placeholder tab holds one collapsed ibox per locale, so every locale gets the same value.
  private fillLocalizedPlaceholder = (getBlock: () => Cypress.Chainable, value: string): void => {
    getBlock()
      .find(this.repository.getAllCollapsedIboxButtonsSelector())
      .each(($button) => {
        cy.wrap($button).click();
      });

    getBlock()
      .find(this.repository.getAllIboxesSelector())
      .each(($ibox) => {
        cy.wrap($ibox)
          .find(this.repository.getLocalizedTextareaSelector())
          .each(($input) => {
            cy.wrap($input).clear({ force: true });
            cy.wrap($input).type(value, { force: true });
          });
      });
  };

  private saveAndPublish = (): void => {
    this.repository.getUpdatePlaceholderButton().click();

    this.repository.getPublishPageButton().click({ force: true });
  };
}

interface UpdateParams {
  cmsPageName: string;
}

interface UpdateTitleAndContentParams {
  title: string;
  content: string;
}
