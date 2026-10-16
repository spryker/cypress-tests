import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { AclDeniedRepository } from './acl-denied-repository';

@injectable()
@autoWired
export class AclDeniedPage extends BackofficePage {
  @inject(AclDeniedRepository) private repository: AclDeniedRepository;

  protected PAGE_URL = '/acl/index/denied';

  getAccessDeniedTitle = (): Cypress.Chainable => this.repository.getAccessDeniedTitle();
}
