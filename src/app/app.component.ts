import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
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
    this.deleteLocalStorageParams();
  }

  private deleteLocalStorageParams() {
    const isGoOut = JSON.parse( localStorage.getItem( 'goOut' ) );
    if ( isGoOut ) {
      localStorage.removeItem( 'returnToSaveUrl' );
      localStorage.removeItem( 'breadcrumbs' );
      localStorage.removeItem( 'goOut' );
    }
  }

  private returnToSaveUrl() {
    // ----------------- Сохранение последнего URL ----------------
    const isGoOut = JSON.parse( localStorage.getItem( 'goOut' ) );
    this.router.events
      .pipe( filter( event => event instanceof NavigationStart ) )
      .subscribe( ( { id, url }: NavigationStart ) => {
        const findId = R.find( ( history: { id: number, url: string } ) => history.id === 1 );
        this.history = [ ...this.history, { id, url } ];
        this.historyFind = findId( this.history );
        if ( url !== '/' && !isGoOut ) localStorage.setItem( 'returnToSaveUrl', this.historyFind.url );
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
