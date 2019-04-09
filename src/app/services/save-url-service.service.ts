import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import * as R from 'ramda';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveUrlServiceService {

  private history: { id: number, url: string }[] = [];
  private historyFind: { id: number, url: string };
  private isGoOut: string = JSON.parse( localStorage.getItem( 'goOut' ) );

  public subjectEvent401 = new Subject();

  constructor( private router: Router ) { }

  public deleteLocalStorageParams() {
    if ( this.isGoOut ) {
      localStorage.removeItem( 'returnToSaveUrl' );
      localStorage.removeItem( 'breadcrumbs' );
      localStorage.removeItem( 'goOut' );
    }
  }

  public saveUrl() {
    // ----------------- Сохранение последнего URL ----------------
    this.router.events
      .pipe( filter( event => event instanceof NavigationStart ) )
      .subscribe( ( { id, url }: NavigationStart ) => {
        const findId = R.find( ( history: { id: number, url: string } ) => history.id === 1 );
        this.history = [ ...this.history, { id, url } ];
        this.historyFind = findId( this.history );
        if ( url !== '/' && !this.isGoOut ) localStorage.setItem( 'returnToSaveUrl', this.historyFind.url );
      } );
  }
}
