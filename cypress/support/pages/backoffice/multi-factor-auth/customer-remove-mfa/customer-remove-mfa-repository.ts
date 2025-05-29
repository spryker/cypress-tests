import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerRemoveMfaRepository {
  getRemoveButtonSelector = (): string => 'button[data-qa="confirm-remove-mfa"]';
}
