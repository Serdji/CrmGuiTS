import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEmail } from '../../../interface/iemail';
import { takeWhile } from 'rxjs/operators';
import { ListEmailService } from './list-email.service';
import { timer } from 'rxjs';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';
import { ITaskLog } from '../../../interface/itask-log';
import { DistributionService } from '../distribution.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-list-email',
  templateUrl: './list-email.component.html',
  styleUrls: [ './list-email.component.styl' ]
} )
export class ListEmailComponent implements OnInit, OnDestroy {

  public email: IEmail;
  public isLoader: boolean;



  constructor(
    private listEmailService: ListEmailService,
    private tableAsyncService: TableAsyncService,
    private distributionService: DistributionService,
  ) { }

  ngOnInit(): void {

    this.isLoader = true;
    this.initTable();
    this.initTablePagination();
    this.distributionService.subjectDistributionDelete
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.refreshDistribution() );
  }

  private initTablePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const params = {
          from: pageIndex,
          count: value.pageSize
        };
        this.listEmailService.getAllEmail( params )
          .pipe( untilDestroyed(this) )
          .subscribe( ( email: IEmail ) => this.tableAsyncService.setTableDataSource( email.result ) );
      } );
  }

  private initTable() {
    const params = {
      from: 0,
      count: 10
    };
    this.listEmailService.getAllEmail( params )
      .pipe( untilDestroyed(this) )
      .subscribe( ( email: IEmail ) => {
        this.tableAsyncService.countPage = email.totalRows;
        this.email = email;
        this.isLoader = false;
      } );
  }


  private refreshDistribution() {
    timer( 100 )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initTable();
      } );
  }


  ngOnDestroy(): void {}
}
