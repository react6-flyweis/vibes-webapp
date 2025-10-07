export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IResponseList<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string; // ISO date string
}
