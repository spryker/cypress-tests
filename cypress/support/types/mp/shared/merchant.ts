import { Stock } from './stock';

export interface Merchant {
  id_merchant: number;
  merchant_reference: string;
  name: string;
  stocks: Stock[];
}
