import { injectable } from 'inversify';
import { TrackingRepository } from '../tracking-repository';

@injectable()
export class SuiteTrackingRepository implements TrackingRepository {
  getGoogleAnalyticsAdapterSelector = (): string => 'traceable-events-google-analytics';
  getTrackingOrchestratorSelector = (): string => 'traceable-events-orchestrator';
  getGtagScriptSelector = (): string => 'script[src*="googletagmanager.com/gtag/js"]';
}
