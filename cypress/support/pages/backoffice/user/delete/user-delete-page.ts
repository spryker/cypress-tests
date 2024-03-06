import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficePage } from '../../backoffice-page';
import { UserDeleteRepository } from './user-delete-repository';

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
