export interface TrackingRepository {
  getGoogleAnalyticsAdapterSelector(): string;
  getTrackingOrchestratorSelector(): string;
  getGtagScriptSelector(): string;
}
