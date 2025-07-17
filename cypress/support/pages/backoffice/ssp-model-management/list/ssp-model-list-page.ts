import { injectable } from 'inversify';
import { autoWired } from '@utils';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class SspModelListPage extends BackofficePage {
  protected readonly PAGE_URL = '/self-service-portal-gui/model';
}
