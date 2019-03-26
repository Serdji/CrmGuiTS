import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as R from 'ramda';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
} )
export class AppComponent implements OnInit {

  private history: { id: number, url: string }[] = [];
  private historyFind: { id: number, url: string };

  constructor(
    private router: Router,
    private location: Location,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.returnToSaveUrl();
    this.isTokenRedirect();
    this.updateVersion();
  }

  private returnToSaveUrl() {
    this.router.events
      .pipe( filter( event => event instanceof NavigationStart ) )
      .subscribe( ( { id, url }: NavigationStart ) => {
        const findId = R.find( ( history: { id: number, url: string } ) => history.id === 1 );
        this.history = [ ...this.history, { id, url } ];
        console.log(this.history);
        this.historyFind = findId( this.history );
        console.log( this.historyFind  );
        localStorage.setItem( 'returnToSaveUrl', this.historyFind.url );
      } );
  }

  private isTokenRedirect() {
    const token = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    if ( !token ) {
      timer( 300 ).subscribe( _ => this.router.navigate( [ '/' ] ) );
    } else {
      if ( this.location.path() === '' ) {
        this.router.navigate( [ 'crm' ] );
      }
    }
  }

  private updateVersion() {
    // --------- Событие изменения приложения, Service worker ---------
    this.swUpdate.available.subscribe( _ => {
      const snackBarRef = this.snackBar.open( 'Приложение было обновлено, просьба перезагрузить приложение.', 'Перезагрузить' );
      snackBarRef.onAction().subscribe( () => {
        location.reload();
      } );
    } );
  }

}
