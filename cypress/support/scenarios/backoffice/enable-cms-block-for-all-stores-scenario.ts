import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BlockUpdatePage, BlockListPage } from '@pages/backoffice';

@injectable()
@autoWired
export class EnableCmsBlockForAllStoresScenario {
  @inject(BlockUpdatePage) private blockUpdatePage: BlockUpdatePage;
  @inject(BlockListPage) private blockListPage: BlockListPage;

  execute = (params: ExecuteParams): void => {
    this.blockListPage.visit();

    this.blockListPage.interceptTable({ url: '/cms-block-gui/list-block/table**' }).then(() => {
      this.blockListPage
        .find({
          searchQuery: params.cmsBlockName,
          tableUrl: '/cms-block-gui/list-block/table**',
        })
        .then(($cmsBlockRow) => {
          if (!this.blockListPage.rowIsAssignedToStore({ row: $cmsBlockRow, storeName: params.storeName })) {
            this.blockListPage.clickEditAction($cmsBlockRow);

            this.blockUpdatePage.assignAllAvailableStore();
            this.blockUpdatePage.save();

            if (params?.shouldTriggerPublishAndSync) {
              cy.runCliCommands(['vendor/bin/console queue:worker:start --stop-when-empty']);
            }
          }
        });
    });
  };
}

interface ExecuteParams {
  cmsBlockName: string;
  shouldTriggerPublishAndSync?: boolean;
  storeName?: string;
}
