import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEmail } from '../../../interface/iemail';
import { takeWhile } from 'rxjs/operators';
import { ListEmailService } from './list-email.service';
import { timer } from 'rxjs';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';
import { ITaskLog } from '../../../interface/itask-log';

@Component( {
  selector: 'app-list-email',
  templateUrl: './list-email.component.html',
  styleUrls: [ './list-email.component.styl' ]
} )
export class ListEmailComponent implements OnInit, OnDestroy {

  public email: IEmail[];
  public isLoader: boolean;

  private isActive: boolean;

  constructor(
    private listEmailService: ListEmailService,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initDistribution();
    this.listEmailService.subjectDistributionDelete
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
        // this.eventService.getSearchTackLogs( params )
        //   .pipe( takeWhile( _ => this.isActive ) )
        //   .subscribe( ( taskLog: ITaskLog ) => this.tableAsyncService.setTableDataSource( taskLog.result ) );
      } );
  }

  private initTable() {
    const params = {
      from: 0,
      count: 10
    };
    // this.eventService.getSearchTackLogs( params )
    //   .pipe( takeWhile( _ => this.isActive ) )
    //   .subscribe( ( taskLog: ITaskLog ) => {
    //     this.tableAsyncService.countPage = taskLog.totalRows;
    //     this.taskLog = taskLog;
    //     this.isLoader = false;
    //   } );
  }


  private refreshDistribution() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initDistribution();
      } );
  }

  private initDistribution() {
    this.listEmailService.getAllEmail()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( email: IEmail[] ) => {
        this.email = email;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
