import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PageCreateRepository } from './page-create-repository';

@injectable()
@autoWired
export class PageCreatePage extends BackofficePage {
  @inject(PageCreateRepository) private repository: PageCreateRepository;

  protected PAGE_URL = '/cms-gui/create-page';

  create = (params: CreateParams): Page => {
    const page = {
      name: params.cmsPageName || this.faker.internet.displayName(),
    };

    this.repository.getCollapsedIboxButton().click({ force: true });

    this.repository.getDeNameInput().type(page.name, { force: true });
    this.repository.getDeUrlInput().type(page.name, { force: true });

    this.repository.getEnNameInput().type(page.name, { force: true });
    this.repository.getEnUrlInput().type(page.name, { force: true });

    this.repository.getCreatePageButton().click();

    return page;
  };
}

interface CreateParams {
  cmsPageName?: string;
}

// TODO -- not needed?
interface Page {
  name: string;
}
