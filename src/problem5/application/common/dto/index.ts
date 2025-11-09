export class PaginationDto<T> {
  items: T[];
  totalPages: number;
  page: number;
  pageSize: number;

  constructor(items: T[], totalPages: number, page: number, pageSize: number) {
    this.items = items;
    this.totalPages = totalPages;
    this.page = page;
    this.pageSize = pageSize;
  }
}
