import { Store, User } from './shared';

export interface HealthCheckDmsStaticFixtures {
    store: Store;
    defaultPassword: string;
}

export interface HealthCheckDmsDynamicFixtures {
    rootUser: User;
}
