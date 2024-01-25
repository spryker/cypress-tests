import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeUserDeleteRepository } from './backoffice-user-delete-repository';

@injectable()
@autoProvide
export class BackofficeUserDeletePage extends AbstractPage {
  public PAGE_URL: string = '/user/edit/confirm-delete';

  constructor(@inject(BackofficeUserDeleteRepository) private repository: BackofficeUserDeleteRepository) {
    super();
  }

  public confirmDelete = (): void => {
    this.repository.getDeleteButton().click();
  };
}
