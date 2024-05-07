export interface District {
  districtId: number;
  districtName: string;
}

interface SaleInfoContent {
  id: number;
  eventId: number;
  districtId: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface SaleInfo {
  recentNewsCount: number;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  content: SaleInfoContent[];
}
