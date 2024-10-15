import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { CmsPageCreatePage, CmsPlaceholderEditPage } from '@pages/backoffice';

@injectable()
@autoWired
export class CreateCmsPageScenario {
  @inject(CmsPageCreatePage) private CmsPageCreatePage: CmsPageCreatePage;
  @inject(CmsPlaceholderEditPage) private CmsPlaceholderEditPage: CmsPlaceholderEditPage;

  execute = (params: ExecuteParams): void => {
    this.CmsPageCreatePage.visit();
    this.CmsPageCreatePage.create({ cmsPageName: params.cmsPageName });

    this.CmsPlaceholderEditPage.update({ cmsPageName: params.cmsPageName });

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
