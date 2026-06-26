export interface QuicksightAnalyticsRepository {
  getSectionTitleSelector(): string;
  getTitleActionSelector(): string;
  getSynchronizeUsersButtonSelector(): string;
  getNoPermissionMessageSelector(): string;
}
