import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { UserDeleteRepository } from './user-delete-repository';

@injectable()
@autoWired
export class UserDeletePage extends BackofficePage {
  @inject(UserDeleteRepository) private repository: UserDeleteRepository;

  protected PAGE_URL = '/user/edit/confirm-delete';

  confirmDelete = (): void => {
    this.repository.getDeleteButton().click();
  };
}
