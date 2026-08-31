import { User } from './shared';

export interface Navigation {
  id_navigation: number;
  name: string;
  key: string;
}

export interface NavigationNode {
  id_navigation_node: number;
}

export interface NavigationTreeManagementStaticFixtures {
  defaultPassword: string;
  cmsPageUrlEn: string;
  cmsPageUrlDe: string;
  categoryUrlEn: string;
  categoryUrlDe: string;
}

export interface NavigationTreeManagementDynamicFixtures {
  rootUser: User;
  navigationEmpty: Navigation;
  navigationWithoutType: Navigation;
  navigationExternalUrl: Navigation;
  externalUrlNode: NavigationNode;
  navigationCategory: Navigation;
  categoryNode: NavigationNode;
  navigationCmsPage: Navigation;
  cmsPageNode: NavigationNode;
  navigationStructure: Navigation;
  structureNode1: NavigationNode;
  structureNode11: NavigationNode;
  structureNode2: NavigationNode;
}
