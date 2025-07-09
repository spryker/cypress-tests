import { autoWired } from '@utils';
import { injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class SspInquiryListPage extends BackofficePage {
  protected PAGE_URL = '/self-service-portal/list-inquiry';
}
