import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeUserDeleteRepository } from './backoffice-user-delete-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class BackofficeUserDeletePage extends BackofficePage {
  protected PAGE_URL: string = '/user/edit/confirm-delete';

  constructor(@inject(BackofficeUserDeleteRepository) private repository: BackofficeUserDeleteRepository) {
    super();
  }

  public confirmDelete = (): void => {
    this.repository.getDeleteButton().click();
  };
}
