import { User } from './shared';

export interface NavigationMenuFilterStaticFixtures {
  defaultPassword: string;
  rootUser: User;
  searchTermShort: string;
  searchTermValid: string;
  searchTermWithParentAndChild: string;
  expectedParentLabel: string;
  expectedChildLabel: string;
}
