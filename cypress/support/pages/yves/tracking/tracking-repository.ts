export interface TrackingRepository {
  getGoogleAnalyticsAdapterSelector(): string;
  getTrackingOrchestratorSelector(): string;
  getGtagScriptSelector(): string;
  getItemListSelector(itemListIdPrefix: string): string;
  getItemListCardSelector(): string;
  getItemListCardLinkSelector(): string;
}
