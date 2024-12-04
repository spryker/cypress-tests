import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { YvesPage } from '@pages/yves';

@injectable()
@autoWired
export class IndexPage extends YvesPage {
  protected PAGE_URL = '/';
}
