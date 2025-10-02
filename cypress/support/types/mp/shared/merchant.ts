import { Stock } from './stock';

export interface Merchant {
  merchant_reference: string;
  name: string;
  stocks: Stock[];
}
