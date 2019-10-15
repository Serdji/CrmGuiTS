import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { takeWhile } from 'rxjs/operators';
import { IpagPage } from '../../../interface/ipag-page';
import { timer } from 'rxjs';
import { ListSmsService } from './list-sms.service';

@Component( {
  selector: 'app-list-sms',
  templateUrl: './list-sms.component.html',
  styleUrls: [ './list-sms.component.styl' ]
} )
export class ListSmsComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public sms: any;

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private listSmsService: ListSmsService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initTable();
    this.initTablePagination();
    this.listSmsService.subjectDistributionDelete
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshDistribution() );
  }

  private initTablePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const params = {
          from: pageIndex,
          count: value.pageSize
        };
        this.listSmsService.getAllSms( params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( sms => this.tableAsyncService.setTableDataSource( sms.result ) );
      } );
  }

  private initTable() {
    const params = {
      from: 0,
      count: 10
    };
    this.listSmsService.getAllSms( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( sms => {
        this.tableAsyncService.countPage = sms.totalRows;
        this.sms = sms;
        console.log( this.sms );
        this.isLoader = false;
      } );
  }


  private refreshDistribution() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initTable();
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
