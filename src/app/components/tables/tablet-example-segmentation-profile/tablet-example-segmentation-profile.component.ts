import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { TabletExampleSegmentationProfileService } from './tablet-example-segmentation-profile.service';
import { IpagPage } from '../../../interface/ipag-page';

@Component( {
  selector: 'app-tablet-example-segmentation-profile',
  templateUrl: './tablet-example-segmentation-profile.component.html',
  styleUrls: [ './tablet-example-segmentation-profile.component.styl' ],
} )
export class TabletExampleSegmentationProfileComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;
  public resultsLength: number;
  public isLoadingResults: boolean = false;

  private isActive: boolean;


  @Input() private tableDataSource: any;

  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tabletExampleSegmentationProfileService: TabletExampleSegmentationProfileService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initDataSource();
    this.initDataSourceAsync();
    this.initPaginator();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'firstName',
      'lastName',
      'secondName',
      'customerId',
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private initPaginator() {
    this.resultsLength = this.tabletExampleSegmentationProfileService.countPage;
    this.paginator.page
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        this.tabletExampleSegmentationProfileService.setPagPage( value );
        this.isLoadingResults = true;
      } );
  }

  private initDataSourceAsync() {
    this.tabletExampleSegmentationProfileService.subjectTableDataSource
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: any ) => {
        this.dataSourceFun( value );
        this.isLoadingResults = false;
      } );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.dataSource.sort = this.sort;
      } );
  }

  private windowDialog( messDialog: string, status: string, params: any = '', card: string = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status,
        params,
        card,
      },
    } );
  }

  private isChildMore( parentElement ): boolean {
    const getElemCss = getComputedStyle( parentElement );
    const parentWidth = parentElement.offsetWidth - parseInt( getElemCss.paddingRight, 10 );
    const childrenWidth = parentElement.firstElementChild.offsetWidth;
    return childrenWidth > parentWidth;

  }

  cursorPointer( elem: HTMLElement ): void {
    this.isCp = this.isChildMore( elem );
  }

  openText( elem: HTMLElement ): void {
    if ( this.isCp ) {
      const text = elem.innerText;
      this.windowDialog( text, 'text' );
    }
  }


  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach( row => this.selection.select( row ) );
  }

  redirectToProfile( id: number ): void {
    this.router.navigate( [ `/crm/profile/${id}` ] );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}












