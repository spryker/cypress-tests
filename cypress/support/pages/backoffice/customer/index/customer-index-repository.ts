import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CustomerIndexRepository {
  getRemoveMultiFactorAuthenticationButtonSelector = (): string => 'a[data-qa="remove-mfa-button"]';
}
