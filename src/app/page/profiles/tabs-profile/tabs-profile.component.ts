import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProfileService } from './profile/profile.service';
import { Iprofile } from '../../../interface/iprofile';
import { OrderService } from './order/order.service';

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

  private isActive: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileId = params.id;
        this.initProfile( this.profileId );
        this.initBooking( this.profileId );
      } );
  }

  private initProfile( id: number ) {
    this.profileProgress = true;
    this.profileService.getProfile( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value ) => {
        Object.assign( value, value.customerNames.filter( customerName => customerName.customerNameType === 1 )[ 0 ] );
        this.profile = value;
        this.profileProgress = false;
      } );


  }

  private initBooking( id ) {
    // YESSEN SYPATAYEV
    // АМИНА АДИЛОВНА ЗАКАРЬЯЕВА
    this.ordersProgress = true;
    this.orderService.getBooking( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( orders => {
        this.orders = orders;
        this.ordersProgress = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
