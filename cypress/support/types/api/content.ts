import { Store, User } from '../backoffice/shared';

export interface ContentStaticFixtures {
    cmsPageName: string;
    store: Store;
    pageName: string;
    defaultPassword: string;
}
export interface ContentDynamicFixtures {
    rootUser: User;
}
