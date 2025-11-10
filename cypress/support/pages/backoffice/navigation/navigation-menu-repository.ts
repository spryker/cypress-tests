import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class NavigationMenuRepository {
  getFilterInputSelector = (): string => '[data-qa="menu-filter-input"]';
  getNavigationMenuSelector = (): string => '[data-qa="navigation-menu"]';
  getMenuItemSelector = (): string => '[data-qa="menu-item"]';
  getMenuParentItemSelector = (): string => '[data-qa="menu-parent-item"]';
  getMenuItemLabelSelector = (): string => '[data-qa="menu-item-label"]';
  getMenuSubmenuSelector = (): string => '[data-qa="menu-submenu"]';
  getActiveMenuItemSelector = (): string => '[data-qa="menu-parent-item"].active';
  getMatchedMenuItemSelector = (): string => '[data-qa="menu-parent-item"].matched';
  getHiddenMenuItemsSelector = (): string =>
    '[data-qa="navigation-menu"] [data-qa="menu-item"]:not(:visible), [data-qa="navigation-menu"] [data-qa="menu-parent-item"]:not(:visible)';
  getVisibleMenuItemsSelector = (): string => '[data-qa="menu-item"]:visible, [data-qa="menu-parent-item"]:visible';
  getFilteredMenuSelector = (): string => '[data-qa="navigation-menu"].filtered';
}
