import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { PlaceholdersEditRepository } from './placeholders-edit-repository';

@injectable()
@autoWired
export class PlaceholdersEditPage extends BackofficePage {
  @inject(PlaceholdersEditRepository) private repository: PlaceholdersEditRepository;

  protected PAGE_URL = 'cms-gui/create-glossary/index';

  update = (params: UpdateParams): void => {
    this.repository.getCollapsedIbox().click({ force: true });

    this.repository.getDeLocalizedTextarea().clear({ force: true }).type(params.cmsPageName, { force: true });

    this.repository.getEnLocalizedTextarea().clear({ force: true }).type(params.cmsPageName, { force: true });

    this.repository.getUpdatePlaceholderButton().click();

    this.repository.getPublishPageButton().click({ force: true });
  };
}

interface UpdateParams {
  cmsPageName: string;
}
