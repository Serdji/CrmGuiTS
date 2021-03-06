import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, last, map, tap, toArray } from 'rxjs/operators';
import { ProfileService } from './profile/profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { OrderService } from './order/order.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { CurrencyDefaultService } from '../../../services/currency-default.service';
import { ISettings } from '../../../interface/isettings';
import { TabsProfileService } from '../../../services/tabs-profile.service';
import { ITabsControlData } from '../../../interface/itabs-control-data';
import { Observable, of, timer } from 'rxjs';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { ISegmentation } from '../../../interface/isegmentation';
import { IcustomerGroupRelations } from '../../../interface/icustomer-group-relations';
import { ConvertToStream } from '../../../utils/ConvertToStream';

@Component( {
  selector: 'app-tabs-profile',
  templateUrl: './tabs-profile.component.html',
  styleUrls: [ './tabs-profile.component.styl' ]
} )
export class TabsProfileComponent implements OnInit, OnDestroy {

  public profileId: number;
  public createDate: string;
  public profile: Iprofile;
  public profile$: Observable<Iprofile[]>;
  public profileProgress: boolean;
  public profileSegmentationProgress: boolean;
  public ordersProgress: boolean;
  public isProfileCreateDate: boolean;
  public ordersLast$: Observable<any>;
  public accessDisabledMessages: boolean;
  public accessDisabledPromoCode: boolean;
  public accessDisabledPrivileges: boolean;
  public currencyDefault: string;
  public selectedIndex: number;
  public dataOrder: { recLocGDS: string };
  public distributionId: { distributionId: number };
  public dataPromoCode: { promoCodeId: number };
  public profileSegmentation: {
    takeSegmentation: ISegmentation[];
    segmentation: ISegmentation[];
    isPointer: boolean;
  };
  public profileGroup: {
    takeProfileGroup: IcustomerGroupRelations[];
    profileGroup: IcustomerGroupRelations[];
    isPointer: boolean;
    profileId: number;
  };


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private profileGroupService: ProfileGroupService,
    private currencyDefaultService: CurrencyDefaultService,
    private tabsProfileService: TabsProfileService,
    private convertToStream: ConvertToStream
  ) { }

  ngOnInit(): void {
    this.ordersProgress = true;
    this.profileProgress = true;
    this.profileSegmentationProgress = true;
    this.selectedIndex = null;
    this.initQueryRouter();
    this.initCurrencyDefault();
    this.initTabsControlData();
    this.initSubjects();
  }

  private initTabsControlData() {
    const tabsControlData = this.tabsProfileService.getControlTabsData;
    if ( tabsControlData ) {
      timer( 0 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => this.tabsProfileService.subjectControlTabsData.next( tabsControlData ) );
      this.tabsProfileService.setControlTabsData = null;
    }
  }

  private initSubjects() {
    this.profileGroupService.subjectProfileGroup
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.initProfile( this.profileId );
      } );
    this.tabsProfileService.subjectControlTabsData
      .pipe( untilDestroyed( this ) )
      .subscribe( ( tabsControlData: ITabsControlData ) => {
        // this.selectedIndex = 0;
        timer( 0 )
          .pipe( untilDestroyed( this ) )
          .subscribe( _ => {
            this.selectedIndex = tabsControlData.selectedIndex;
            this.dataOrder = tabsControlData.order;
            this.distributionId = tabsControlData.message;
            this.dataPromoCode = tabsControlData.promoCode;
          } );
      } );
  }

  private initQueryRouter() {
    this.route.params
      .pipe( untilDestroyed( this ) )
      .subscribe( params => {
        this.profileId = params.id;
        this.initProfile( this.profileId );
        this.initOrder( this.profileId );
      } );
  }

  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initOrder( id: number ) {
    this.ordersLast$ = this.orderService.getBooking( id )
      .pipe(
        tap( orders => {
            this.orderService.subjectOrders.next( orders );
            this.ordersProgress = false;
            this.isProfileCreateDate = false;
          }
        ),
        this.convertToStream.stream(
          last()
        ),
        catchError( err => {
          this.initProfile( id );
          this.ordersProgress = false;
          this.isProfileCreateDate = true;
          this.createDate = null;
          this.orderService.subjectOrders.next( [] );
          return of( [] );
        } ),
        tap( orders => {
          if ( !_.isEmpty( orders ) ) this.createDate = orders[ 0 ].createDate;
          this.orderService.subjectOrders.asObservable();
        } )
      );
  }

  private initProfile( id: number ) {
    this.profile$ = this.profileService.getProfile( id )
      .pipe(
        tap( ( profile: Iprofile ) => {
          this.initProfileSegmentation( profile );
          this.initProfileGroup( profile );
        } ),
        map( ( profile: Iprofile ) => _.merge( profile, _.find( profile.customerNames, { 'customerNameType': 1 } ) ) ),
        // @ts-ignore
        map( ( profile: Iprofile ) => _.set( profile, 'customerAge', ( ( new Date().getTime() - new Date( moment( profile.dob ).format( 'YYYY-MM-DD' ) ) ) / ( 24 * 3600 * 365.25 * 1000 ) ) | 0 ) ),
          toArray(),
          tap( ( profile: Iprofile[] ) => {
            this.profileService.subjectGetProfile.next( profile );
            this.profileProgress = false;
            this.profileSegmentationProgress = false;
          } ),
        )
    ;
  }

  private initProfileSegmentation( profile: Iprofile ) {
    this.profileSegmentation = {
      takeSegmentation: _.take( profile.segmentations, 3 ),
      segmentation: profile.segmentations,
      isPointer: _.size( profile.segmentations ) > 3
    };
  }

  private initProfileGroup( profile: Iprofile ) {
    this.profileGroup = {
      takeProfileGroup: _.take( profile.customerGroupRelations, 3 ),
      profileGroup: profile.customerGroupRelations,
      isPointer: _.size( profile.customerGroupRelations ) > 3,
      profileId: this.profileId
    };
  }

  private windowDialog( status: string, params: any = '', card: string = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        status,
        params,
        card,
      },
    } );
  }

  openListSegmentation(): void {
    this.windowDialog( 'listSegmentation', this.profileSegmentation );
  }

  addProfileGroup(): void {
    this.windowDialog( 'addProfileGroup', this.profileGroup );
  }


  ngOnDestroy(): void {}

}
