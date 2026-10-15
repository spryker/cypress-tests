const LANDING_ORDER = ['1', '6a-1', '3', '2', '4', '4b', '5', '7a', '6a-2', '6b', '6c', '6d', '7b'];

/**
 * The AgenticCommerce stories run only when `agenticCommerceCut` names the cut the suite is on;
 * unset (suite CI) means every story is skipped. Removed once the epic is merged.
 */
export const isAgenticCommerceCutReached = (cut: string): boolean => {
  const currentCut = Cypress.env('agenticCommerceCut');

  if (currentCut === undefined || currentCut === '') {
    return false;
  }

  const currentIndex = LANDING_ORDER.indexOf(String(currentCut));
  const cutIndex = LANDING_ORDER.indexOf(cut);

  if (currentIndex === -1 || cutIndex === -1) {
    throw new Error(`Unknown AgenticCommerce cut "${currentIndex === -1 ? currentCut : cut}".`);
  }

  return cutIndex <= currentIndex;
};
