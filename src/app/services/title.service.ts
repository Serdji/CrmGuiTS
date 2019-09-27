import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable( {
  providedIn: 'root'
} )
export class TitleService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private titleService: Title
  ) { }

  dataTitle() {
    this.router.events
      .pipe(
        filter( event => event instanceof NavigationEnd ),
        map( () => this.activatedRoute ),
        map( route => route.root.firstChild.snapshot.children[ 0 ] ),
        map( route => route ? route.data.title : 'BREADCRUMBS.HOME' ),
      )
      .subscribe( stateTitle => {
        this.translate.stream( stateTitle )
          .subscribe( ( value ) => {
            this.titleService.setTitle( `Leonardo.CRM - ${value}` );
          } );
      } );
  }

  set title( title: string ) {
    this.titleService.setTitle( `Leonardo.CRM - ${title}` );
  }

}
