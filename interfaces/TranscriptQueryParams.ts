import { Pagination } from './pagination';

export type SortField = 'deposition_date' | 'witness_name';
export type SortOrder = 'asc' | 'desc';

export interface TranscriptQueryParams extends Pagination {
  sortField?: SortField;
  sortOrder?: SortOrder;
  witnessName?: string;
}
