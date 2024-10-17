import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { inject, injectable } from 'inversify';
import { BlockUpdateRepository } from './block-update-repository';

@injectable()
@autoWired
export class BlockUpdatePage extends BackofficePage {
  @inject(BlockUpdateRepository) private repository: BlockUpdateRepository;

  protected PAGE_URL = '/cms-block-gui/edit-block';
  assignAllAvailableStore = (): void => {
    this.repository.getAllAvailableStoresInputs().check();
  };

  save = (): void => {
    this.repository.getSaveButton().click();
  };
}
