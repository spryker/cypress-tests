import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { UserDeleteRepository } from './user-delete-repository';

@injectable()
@autoWired
export class UserDeletePage extends BackofficePage {
  @inject(UserDeleteRepository) private repository: UserDeleteRepository;

  protected PAGE_URL = '/user/edit/confirm-delete';

  confirm = (): void => {
    this.repository.getDeleteButton().click();
  };
}
