export interface DashboardSummaryCard {
  label: string;
  value: number;
  tone: 'brand' | 'danger' | 'warning' | 'success';
}

export interface DashboardQuickAction {
  title: string;
  href: string;
}

export interface DashboardPayload {
  summaryCards: DashboardSummaryCard[];
  quickActions: DashboardQuickAction[];
}
