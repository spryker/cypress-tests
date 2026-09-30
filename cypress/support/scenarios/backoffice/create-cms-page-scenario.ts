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

    if (params.placeholders) {
      this.cmsPlaceholderEditPage.updateTitleAndContent(params.placeholders);
    } else {
      this.cmsPlaceholderEditPage.update({ cmsPageName: params.cmsPageName });
    }

    if (params.shouldTriggerPublishAndSync) {
      cy.runQueueWorker();
    }
  };
}

interface ExecuteParams {
  cmsPageName: string;
  // Omit to write the page name into the title placeholder, which is all most callers need.
  placeholders?: { title: string; content: string };
  shouldTriggerPublishAndSync?: boolean;
}
