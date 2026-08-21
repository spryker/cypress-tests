export interface PriceOverrideOptions {
  netAmount?: unknown;
  grossAmount?: unknown;
  omitPrice?: boolean;
}

/**
 * Clones the base price and applies the negative-case overrides used by the cart and shopping list tests:
 * override `netAmount`/`grossAmount`, or drop both fields entirely with `omitPrice`.
 */
export function applyPriceOverrides(
  basePrice: Record<string, unknown>,
  { netAmount, grossAmount, omitPrice }: PriceOverrideOptions
): Record<string, unknown> {
  const price = { ...basePrice };

  if (netAmount !== undefined) {
    price.netAmount = netAmount;
  }
  if (grossAmount !== undefined) {
    price.grossAmount = grossAmount;
  }
  if (omitPrice) {
    delete price.netAmount;
    delete price.grossAmount;
  }

  return price;
}

export interface ProductConfigurationInstanceData {
  displayData: string;
  configuration: string;
  configuratorKey: string;
  quantity: number;
  availableQuantity: number;
  prices: unknown[];
}

/**
 * Builds a `productConfigurationInstance` payload shared by the cart, shopping list and checkout API tests.
 * Pass `isComplete = null` to omit the field (used by the negative "missing isComplete" case).
 */
export function buildProductConfigurationInstance(
  data: ProductConfigurationInstanceData,
  isComplete: boolean | null = true
): Record<string, unknown> {
  const instance: Record<string, unknown> = {
    displayData: data.displayData,
    configuration: data.configuration,
    configuratorKey: data.configuratorKey,
    quantity: data.quantity,
    availableQuantity: data.availableQuantity,
    prices: data.prices,
  };

  if (isComplete !== null) {
    instance.isComplete = isComplete;
  }

  return instance;
}
