import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CmsPageUpdateRepository } from './cms-page-update-repository';

@injectable()
@autoWired
export class CmsPageUpdatePage extends BackofficePage {
  @inject(CmsPageUpdateRepository) private repository: CmsPageUpdateRepository;

  protected PAGE_URL = '/cms-gui/edit-page';

  visitPage = (idCmsPage: string): void => {
    cy.visitBackoffice(`${this.PAGE_URL}?id-cms-page=${idCmsPage}`);
  };

  unassignStore = (storeName: string): void => {
    this.repository.getStoreCheckbox(storeName).uncheck();
  };

  // Saving only writes a new draft version; the storefront keeps serving the published one
  // until the draft is published too, which is why both clicks belong to one method.
  saveAndPublish = (): void => {
    this.repository.getSaveButton().click();
    this.repository.getPublishButton().click({ force: true });
  };
}
