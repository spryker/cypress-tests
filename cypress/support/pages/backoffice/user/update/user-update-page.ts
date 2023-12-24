import { UserUpdateRepository } from './user-update-repository';
import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class UserUpdatePage extends AbstractPage {
  PAGE_URL: string = '/user/edit/update';
  repository: UserUpdateRepository;

  constructor(@inject(UserUpdateRepository) repository: UserUpdateRepository) {
    super();
    this.repository = repository;
  }

  checkMerchantAgentCheckbox = (): void => {
    this.repository.getAgentMerchantCheckbox().check();
    this.repository.getUpdateUserButton().click();
  };
}
