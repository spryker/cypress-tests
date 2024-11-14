import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CategoryEditRepository } from './category-edit-repository';

@injectable()
@autoWired
export class CategoryEditPage extends BackofficePage {
  @inject(CategoryEditRepository) private repository: CategoryEditRepository;

  protected PAGE_URL = '/category-gui/edit';

  unassignStore = (params: UnassignParams): void => {
    this.repository.getStoreSelect().select(params.storeName, { force: true });
    this.repository.getSaveButton().click();
  };
}

interface UnassignParams {
  storeName: string;
}
