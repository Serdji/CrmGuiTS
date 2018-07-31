import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-tabs-profile',
  templateUrl: './tabs-profile.component.html',
  styleUrls: [ './tabs-profile.component.styl' ]
} )
export class TabsProfileComponent implements OnInit, OnDestroy {

  public profileId: number;

  private isActive: boolean = true;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.profileId = params.id;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
