import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile/profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { OrderService } from './order/order.service';
import * as _ from 'lodash';

@Component( {
  selector: 'app-tabs-profile',
  templateUrl: './tabs-profile.component.html',
  styleUrls: [ './tabs-profile.component.styl' ]
} )
export class TabsProfileComponent implements OnInit, OnDestroy {

  public profileId: number;
  public profile: Iprofile;
  public profileProgress: boolean;
  public ordersProgress: boolean;
  public orders;

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileId = params.id;
        this.initOrder( this.profileId );
      } );
  }


  private initOrder( id: number ) {
    this.ordersProgress = true;
    this.profileProgress = true;
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
        }
      );
  }

  private initProfile( id: number, orders? ) {
    this.profileService.getProfile( id )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( profile => {
          if ( orders ) {
            const { lut } = _.minBy( orders, o => o.lut );
            return _.merge( profile, { lut } );
          }
          return profile;
        } ) ).subscribe( ( profile ) => {
      _.merge( profile, _.find( profile.customerNames, { 'customerNameType': 1 } ) );
      this.profile = profile;
      this.profileProgress = false;
    } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
