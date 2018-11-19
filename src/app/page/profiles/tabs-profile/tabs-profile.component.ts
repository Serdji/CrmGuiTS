import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile/profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { OrderService } from './order/order.service';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';

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
  public accessDisabled: boolean;

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private profileGroupService: ProfileGroupService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileId = params.id;
        this.initOrder( this.profileId );
        this.profileGroupService.subjectProfileGroup
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.initProfile( this.profileId, this.orders );
          } );
      } );
  }


  private initOrder( id: number ) {
    this.ordersProgress = true;
    this.profileProgress = true;
    this.profileSegmentationProgress = true;
    this.orderService.getBooking( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe(
        orders => {
          this.initProfile( id, orders );
          this.orders = orders;
          this.ordersProgress = false;
        },
        error => {
          this.initProfile( id );
          this.ordersProgress = false;
        },
        () => {
          this.initProfile( id );
          this.ordersProgress = false;
        }
      );
  }

  private initProfile( id: number, orders? ) {
    this.profileService.getProfile( id )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( profile => {
          if ( orders ) {
            const { createDate } = _.minBy( orders, o => o.createDate );
            return _.merge( profile, { createDate } );
          }
          return profile;
        } ) )
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
