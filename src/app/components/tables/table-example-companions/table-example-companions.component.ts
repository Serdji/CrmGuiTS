import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { ContactService } from '../../../page/profiles/tabs-profile/contact/contact.service';
import { Icontact } from '../../../interface/icontact';

import { untilDestroyed } from 'ngx-take-until-destroy';
import * as R from 'ramda';
import { TabsProfileService } from '../../../services/tabs-profile.service';

@Component( {
  selector: 'app-table-example-companions',
  templateUrl: './table-example-companions.component.html',
  styleUrls: [ './table-example-companions.component.styl' ],
} )
export class TableExampleCompanionsComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isCp: boolean = false;
  public selection = new SelectionModel<any>( true, [] );
  public isDisabled: boolean;



  @Input() private tableDataSource: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog,
    private router: Router,
    private tabsProfileService: TabsProfileService
  ) { }

  ngOnInit(): void {

    this.initDataSource();
    this.initDisplayedColumns();
  }

  private initDisplayedColumns() {
    this.displayedColumns = [
      'customerId',
      'recLoc',
      'documentNumber',
      'firstName',
      'lastName',
      'secondName',
      'dob',
      'ageGroup',
      'router',
    ];
  }

  private initDataSource() {
    this.dataSourceFun( this.tableDataSource );
  }

  private dataSourceFun( params ) {
    this.dataSource = new MatTableDataSource( params );
    timer( 1 )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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

  contactDistribution( params: any ): void {
    const isSubjectNext = false;
    _.set( params, 'useForDistribution', !params.useForDistribution );
    this.contactService.putContact( params, isSubjectNext )
      .pipe( untilDestroyed(this) )
      .subscribe( ( contact: Icontact ) => {
        _.chain( this.tableDataSource )
          .find( [ 'contactId', contact.contactId ] )
          .set( 'useForDistribution', contact.useForDistribution )
          .value();
        this.dataSourceFun( this.tableDataSource );
      } );
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

  applyFilter( filterValue: string ): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCreate( typeCode, typeId, contactId, customerId, text ): void {
    this.windowDialog( ``, 'updateContact', { typeCode, typeId, contactId, customerId, text }, 'contact' );
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

  deleteContact(): void {
    const arrayId = [];
    const checkbox = Array.from( document.querySelectorAll( 'mat-table input' ) );
    checkbox.forEach( ( el: HTMLInputElement ) => {
      if ( el.checked ) {
        const id = el.id.split( '-' );
        if ( Number.isInteger( +id[ 0 ] ) ) arrayId.push( +id[ 0 ] );
      }
    } );

    if ( arrayId.length !== 0 ) {
      const params = Object.assign( {}, { ids: arrayId } );
      this.windowDialog( `DIALOG.DELETE.CONTACT`, 'delete', params, 'contacts' );
    }
  }

  redirectToDisplayed( id: number, recLocGDS: string ): void {
    this.router.navigate( [ `/crm/profile/${id}` ] );
    const params = {
      selectedIndex: 3,
      order: {
        recLocGDS
      }
    };
    this.tabsProfileService.subjectControlTabsData.next( params );
  }

  disabledCheckbox( eventData ): void {
    this.isDisabled = eventData;
  }

  ngOnDestroy(): void {}

}












