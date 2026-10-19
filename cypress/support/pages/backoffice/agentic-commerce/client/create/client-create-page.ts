import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../../backoffice-page';
import { ClientCreateRepository } from './client-create-repository';

@injectable()
@autoWired
export class ClientCreatePage extends BackofficePage {
  @inject(ClientCreateRepository) private repository: ClientCreateRepository;

  protected PAGE_URL = '/agentic-commerce/agentic-commerce-client/create';

  register = (params: RegisterParams): void => {
    this.repository.getClientIdentifierInput().clear().type(params.clientId);
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getRedirectUrisInput().clear().type(params.redirectUri);
    this.repository.getScopeCheckbox(params.scope).check();
    this.repository.getSubmitButton().click();
  };
}

interface RegisterParams {
  clientId: string;
  name: string;
  redirectUri: string;
  scope: string;
}
