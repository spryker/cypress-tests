import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PageCreateRepository } from './page-create-repository';

@injectable()
@autoWired
export class PageCreatePage extends BackofficePage {
  @inject(PageCreateRepository) private repository: PageCreateRepository;

  protected PAGE_URL = '/content-experience-management/page-create';

  createPage = (params: CreatePageParams): void => {
    this.repository.getTemplateSelect().select(params.templateName);
    this.repository.getStoreCheckbox(params.storeName).click();
    this.repository.getNameInput(params.localeName).type(params.name);
    this.repository.getUrlInput(params.localeName).type(params.url);
    this.repository.getSubmitButton().click();
  };
}

interface CreatePageParams {
  templateName: string;
  storeName: string;
  localeName: string;
  name: string;
  url: string;
}
