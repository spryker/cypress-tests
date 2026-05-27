export * from './checkout';
export * from './customer-account-management';
export * from './catalog';
export * from './order-management';
export * from './product';
export * from './merchant-portal';
export * from './ssp';

export interface ShopThemeSmokeStaticFixtures {
  defaultPassword: string;
  rootUser: {
    username: string;
  };
  logoFile: string;
}
