import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable( {
  providedIn: 'root'
} )
export class TitleService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) { }

  dataTitle() {
    this.router.events
      .pipe(
        filter( event => event instanceof NavigationEnd ),
        map( () => this.activatedRoute ),
        map( route => route.root.firstChild.snapshot.children[ 0 ] ),
        map( route => {
          if ( route ) return route.data.title;
          return 'Главная';
        } ),
      )
      .subscribe( stateTitle => this.titleService.setTitle( `Leonardo.CRM - ${stateTitle}` ) );
  }
}
