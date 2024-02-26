import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserDeleteRepository } from './user-delete-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class UserDeletePage extends BackofficePage {
  protected PAGE_URL: string = '/user/edit/confirm-delete';

  constructor(@inject(UserDeleteRepository) private repository: UserDeleteRepository) {
    super();
  }

  public confirmDelete = (): void => {
    this.repository.getDeleteButton().click();
  };
}
