export interface AuditLogsRepository {
  getSectionTitleSelector(): string;
  getStatsCardsSelector(): string;
  getStatsCardTitleSelector(): string;
  getTableSelector(): string;
  getTableHeaderSelector(): string;
  getColumnHeaderSelector(column: string): string;
}
