import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorService extends MatPaginatorIntl {
  public itemsPerPageLabel: string;
  public nextPageLabel: string;
  public previousPageLabel: string;
  public firstPageLabel: string;
  public lastPageLabel: string;
  public ofLabel: string;

  constructor(public translate: TranslateService ) {
    super();
    this.translate.stream('TABLE').subscribe(( TABLE ) => {
      this.itemsPerPageLabel = TABLE.ITEMS_PER_PAGE;
      this.nextPageLabel = TABLE.NEXT;
      this.previousPageLabel = TABLE.PREV;
      this.firstPageLabel = TABLE.FIRT_PAGE;
      this.lastPageLabel = TABLE.LAST_PAGE;
      this.ofLabel = TABLE.FROM;
    });
  }

  public getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex: number = page * pageSize;
    const endIndex: number = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.ofLabel} ${length}`;
  }
}
