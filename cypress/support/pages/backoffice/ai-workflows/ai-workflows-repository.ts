export interface AiWorkflowsRepository {
  getSectionTitleSelector(): string;
  getWidgetTitleSelector(): string;
  getTableSelector(): string;
  getTableHeaderSelector(): string;
  getColumnHeaderSelector(column: string): string;
}
