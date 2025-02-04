import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';

@injectable()
@autoWired
export class ClaimDetailPage extends YvesPage {
    public PAGE_URL = '/customer/claim/detail';

}
