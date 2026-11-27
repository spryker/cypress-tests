import { injectable } from 'inversify';
import { TrackingRepository } from '../tracking-repository';

@injectable()
export class B2bMpTrackingRepository implements TrackingRepository {
  getGoogleAnalyticsAdapterSelector = (): string => 'traceable-events-google-analytics';
  getTrackingOrchestratorSelector = (): string => 'traceable-events-orchestrator';
  getGtagScriptSelector = (): string => 'script[src*="googletagmanager.com/gtag/js"]';
  getItemListSelector = (itemListIdPrefix: string): string => `[data-item-list-id^="${itemListIdPrefix}"]`;
  getItemListCardSelector = (): string => '[data-qa="component product-item"]';
  getItemListCardLinkSelector = (): string => 'a[itemprop="url"]';
}
