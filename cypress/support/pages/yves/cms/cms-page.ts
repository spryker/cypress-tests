import {autoWired, REPOSITORIES} from '@utils';
import {inject, injectable} from 'inversify';

import { YvesPage } from '@pages/yves';
import {CmsRepository} from "./cms-repository";

@injectable()
@autoWired
export class CmsPage extends YvesPage {
    @inject(REPOSITORIES.CmsRepository) private repository: CmsRepository;

    protected PAGE_URL = '/';

    getFeaturedProductsBlockTitle = (): string => {
        return this.repository.getFeaturedProductsBlockTitle();
    };

    getProductSelector = (): Cypress.Chainable => {
        return this.repository.getProductSelector();
    }
}
