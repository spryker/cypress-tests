import { Customer } from './shared';

export interface SspAsset {
  name: string;
  serial_number?: string;
  note?: string;
  image?: string;
}

export interface SspAssetCreateSmokeStaticFixtures {
  defaultPassword: string;
  customer: Customer;
  asset: SspAsset;
}
