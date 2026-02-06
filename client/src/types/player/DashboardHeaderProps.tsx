export interface DashboardHeaderProps {
  title: string;

  page: number;
  totalPages: number;

  canPrev: boolean;
  canNext: boolean;

  loading: boolean;

  onPrev: () => void;
  onNext: () => void;
}