import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspModelListRepository {
  getCreateButtonSelector = (): string => '[href*="/self-service-portal/add-model"]';
}
