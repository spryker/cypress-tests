import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BlockUpdatePage } from '../../pages/backoffice/cms/block/update/block-update-page';
import { BlockListPage } from '../../pages/backoffice/cms/block/list/block-list-page';

@injectable()
@autoWired
export class EnableCmsBlockForAllStoresScenario {
  @inject(BlockUpdatePage) private blockUpdatePage: BlockUpdatePage;
  @inject(BlockListPage) private blockListPage: BlockListPage;

  execute = (params: ExecuteParams): void => {
    this.blockListPage.visit();
    this.blockListPage.update({ query: params.cmsBlockName });

    this.blockUpdatePage.assignAllAvailableStore();
    this.blockUpdatePage.save();

    if (params?.shouldTriggerPublishAndSync) {
      cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
    }
  };
}

interface ExecuteParams {
  cmsBlockName: string;
  shouldTriggerPublishAndSync?: boolean;
}
