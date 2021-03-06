import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileGroupService } from './profile-group.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { forkJoin, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Iprofiles } from '../../../interface/iprofiles';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import * as R from 'ramda';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-profile-group',
  templateUrl: './profile-group.component.html',
  styleUrls: [ './profile-group.component.styl' ]
} )
export class ProfileGroupComponent implements OnInit, OnDestroy {


  private customerGroupId: number;

  public isLoader: boolean;
  public formNameProfileGroup: FormGroup;
  public profileGroup: IcustomerGroup[];
  public isLoaderProfileTable: boolean;
  public isTableProfileTable: boolean;
  public profiles: Iprofiles;

  constructor(
    private fb: FormBuilder,
    private profileGroupService: ProfileGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private profileSearchService: ProfileSearchService,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {

    this.isLoader = true;
    this.isLoaderProfileTable = true;
    this.isTableProfileTable = false;
    this.initForm();
    this.initTable();
    this.initQueryParams();
    this.initProfileSearchTablePagination();
    this.profileGroupService.subjectDeleteProfileGroups
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.refreshTable() );
  }

  private initForm() {
    this.formNameProfileGroup = this.fb.group( {
      'CustomerGroupName': ''
    } );
  }

  private refreshTable() {
    timer( 100 )
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initTable();
      } );
  }

  private initTable() {
    this.profileGroupService.getProfileGroup()
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.profileGroup = value;
        this.isLoader = false;
      } );
  }

  private initProfileSearchTablePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed( this ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          customerGroupIds: this.customerGroupId,
          sortvalue: 'last_name',
          from: pageIndex,
          count: value.pageSize
        };
        this.profileSearchService.getProfileSearch( paramsAndCount )
          .pipe( untilDestroyed( this ) )
          .subscribe( profiles => this.tableAsyncService.setTableDataSource( profiles.result ) );
      } );
  }


  private initProfileSearchTable( params: { customerGroupIds: number[], sortvalue: string, from: number, count: number } ) {
    this.customerGroupId = +params.customerGroupIds;
    this.profileSearchService.getProfileSearch( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( profiles => {
        this.tableAsyncService.countPage = profiles.totalRows;
        this.profiles = profiles.result;
        this.isLoaderProfileTable = false;
      } );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed( this ) )
      .subscribe( ( res: { customerGroupIds: number[], sortvalue: string, from: number, count: number } ) => {
        const isRes = !R.isEmpty( res );
        if ( isRes ) this.initProfileSearchTable( res );
        this.isTableProfileTable = isRes;
        this.isLoaderProfileTable = isRes;
      } );
  }

  private resetForm() {
    _( this.formNameProfileGroup.value ).each( ( value, key ) => {
      this.formNameProfileGroup.get( key ).patchValue( '' );
      this.formNameProfileGroup.get( key ).setErrors( null );
    } );
  }

  saveForm(): void {
    const params = this.formNameProfileGroup.getRawValue();
    this.profileGroupService.addProfileGroup( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( () => {
        this.isLoader = true;
        this.resetForm();
        this.initTable();
      } );
  }

  onProfileSearch( id: number ) {
    this.customerGroupId = id;
    const params = {
      customerGroupIds: [ this.customerGroupId ],
      sortvalue: 'last_name',
      from: 0,
      count: 10
    };
    this.isTableProfileTable = true;
    this.isLoaderProfileTable = true;
    this.router.navigate( [ 'crm/profile-group' ], { queryParams: params } );
    this.initProfileSearchTable( params );
  }

  ngOnDestroy(): void {}

}














