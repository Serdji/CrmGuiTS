import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile/profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { OrderService } from './order/order.service';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { CurrencyDefaultService } from '../../../services/currency-default.service';
import { ISettings } from '../../../interface/isettings';
import { TabsProfileService } from '../../../services/tabs-profile.service';
import { ITabsControlData } from '../../../interface/itabs-control-data';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-tabs-profile',
  templateUrl: './tabs-profile.component.html',
  styleUrls: [ './tabs-profile.component.styl' ]
} )
export class TabsProfileComponent implements OnInit, OnDestroy {

  public profileId: number;
  public profile: Iprofile;
  public profileProgress: boolean;
  public profileSegmentationProgress: boolean;
  public ordersProgress: boolean;
  public orders;
  public profileSegmentation: any;
  public profileGroup: any;
  public accessDisabledMessages: boolean;
  public accessDisabledPromoCode: boolean;
  public accessDisabledPrivileges: boolean;
  public currencyDefault: string;
  public selectedIndex: number;
  public dataOrder: { recLocGDS: string };
  public dataMessage: { distributionId: number };
  public dataPromoCode: { promoCodeId: number };

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private profileGroupService: ProfileGroupService,
    private currencyDefaultService: CurrencyDefaultService,
    private tabsProfileService: TabsProfileService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.selectedIndex = 4;
    this.initQueryRouter();
    this.initCurrencyDefault();
    this.initTabsControlData();
    this.initSubjects();
  }

  private initTabsControlData() {
    const tabsControlData = this.tabsProfileService.getControlTabsData;
    if ( tabsControlData ) {
      timer( 0 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => this.tabsProfileService.subjectControlTabsData.next( tabsControlData ) );
      this.tabsProfileService.setControlTabsData = null;
    }
  }

  private initSubjects() {
    this.profileGroupService.subjectProfileGroup
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.initProfile( this.profileId );
      } );
    this.tabsProfileService.subjectControlTabsData
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( tabsControlData: ITabsControlData ) => {
        this.selectedIndex = 0;
        timer( 0 )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.selectedIndex = tabsControlData.selectedIndex;
            this.dataOrder = tabsControlData.order;
            this.dataMessage = tabsControlData.message;
            this.dataPromoCode = tabsControlData.promoCode;
          } );
      } );
  }

  private initQueryRouter() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileId = params.id;
        this.initProfile( this.profileId );
        this.initOrder( this.profileId );
      } );
  }

  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initOrder( id: number ) {
    this.ordersProgress = true;
    this.profileProgress = true;
    this.profileSegmentationProgress = true;
    this.orderService.getBooking( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe(
        orders => {
          this.orders = _.last( orders );
          this.ordersProgress = false;
        },
        error => {
          this.initProfile( id );
          this.ordersProgress = false;
        }
      );
  }

  private initProfile( id: number ) {
    this.profileService.getProfile( id )
      .pipe(
        takeWhile( _ => this.isActive )
      )
      .subscribe( ( profile ) => {
        this.initProfileSegmentation( profile );
        this.initProfileGroup( profile );
        _.merge( profile, _.find( profile.customerNames, { 'customerNameType': 1 } ) );
        this.profile = profile;
        this.profileProgress = false;
      } );
  }

  private initProfileSegmentation( profile: Iprofile ) {

    this.profileSegmentation = {
      takeSegmentation: _.take( profile.segmentations, 3 ),
      segmentation: profile.segmentations,
      isPointer: _.size( profile.segmentations ) > 3
    };
    this.profileSegmentationProgress = false;
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


  ngOnDestroy(): void {
    this.isActive = false;
  }

}
