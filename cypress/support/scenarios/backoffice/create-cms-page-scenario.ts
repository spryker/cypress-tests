import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { PageCreatePage, PlaceholdersEditPage } from '@pages/backoffice';

@injectable()
@autoWired
export class CreateCmsPageScenario {
  @inject(PageCreatePage) private PageCreatePage: PageCreatePage;
  @inject(PlaceholdersEditPage) private PlaceholdersEditPage: PlaceholdersEditPage;

  execute = (params: ExecuteParams): void => {
    this.PageCreatePage.visit();
    this.PageCreatePage.create({ cmsPageName: params.cmsPageName });

    this.PlaceholdersEditPage.update({ cmsPageName: params.cmsPageName });

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
