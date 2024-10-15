import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { CmsPageCreatePage, CmsPlaceholderEditPage } from '@pages/backoffice';

@injectable()
@autoWired
export class CreateCmsPageScenario {
  @inject(CmsPageCreatePage) private cmsPageCreatePage: CmsPageCreatePage;
  @inject(CmsPlaceholderEditPage) private cmsPlaceholderEditPage: CmsPlaceholderEditPage;

  execute = (params: ExecuteParams): void => {
    this.cmsPageCreatePage.visit();
    this.cmsPageCreatePage.create({ cmsPageName: params.cmsPageName });

    this.cmsPlaceholderEditPage.update({ cmsPageName: params.cmsPageName });

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  cmsPageName: string;
  storeName: string;
  shouldTriggerPublishAndSync?: boolean;
}
