import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '../../shared/layout/sidenav/sidenav.service';
import { IMenu } from '../../interface/imenu';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ProfileSearchService } from '../profiles/profile-search/profile-search.service';
import * as R from 'ramda';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: [ './entrance.component.styl' ]
} )
export class EntranceComponent implements OnInit, OnDestroy {


  private contactPhone: string;

  public cards: IMenu[];

  constructor(
    private sidenavService: SidenavService,
    private profileSearchService: ProfileSearchService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.cards = this.sidenavService.menu;
    this.contactPhone = this.route.snapshot.paramMap.get( 'contactPhone' );

    this.initIsContactPhoneOpenProfile();
    this.sidenavService.closesAccord();
  }


  private initIsContactPhoneOpenProfile() {
    if ( this.contactPhone ) {
      const params = {
        contactphone: this.contactPhone,
        sortvalue: 'last_name',
        from: 0,
        count: 10
      };

      const whatResult = result => R.length( result ) === 1;
      const redirectProfile = result => this.router.navigate( ['crm/profile', result[0].customerId] );
      const redirectProfileSearch = _ => this.router.navigate( ['crm/profile-search'], { queryParams: params } );
      const whereRedirect = R.ifElse( whatResult, redirectProfile, redirectProfileSearch );
      const success = profile => whereRedirect( profile.result );

      this.profileSearchService.getProfileSearch( params )
        .pipe( untilDestroyed(this) )
        .subscribe( success );
    }
  }


  openLink(): void {
    this.sidenavService.openAccord();
  }

  ngOnDestroy(): void {}

}
