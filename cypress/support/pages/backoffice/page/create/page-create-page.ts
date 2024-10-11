import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { PageCreateRepository } from './page-create-repository';

@injectable()
@autoWired
export class PageCreatePage extends BackofficePage {
  @inject(PageCreateRepository) private repository: PageCreateRepository;

  protected PAGE_URL = '/cms-gui/create-page';

  create = (params: CreateParams): void => {
    this.repository.getCollapsedIboxButton().click({ force: true });

    this.repository.getDeNameInput().type(params.cmsPageName, { force: true });
    this.repository.getDeUrlInput().type(params.cmsPageName, { force: true });

    this.repository.getEnNameInput().type(params.cmsPageName, { force: true });
    this.repository.getEnUrlInput().type(params.cmsPageName, { force: true });

    this.repository.getCreatePageButton().click();
  };
}

interface CreateParams {
  cmsPageName: string;
}
