import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const token = JSON.parse( localStorage.getItem( 'paramsToken' ) );
    if ( !token ) {
      this.router.navigate( [ '/' ] );
    } else {
      if ( this.location.path() === '' ) {
        this.router.navigate( [ 'crm' ] );
      }
    }
    // --------- Событие изменения приложения, Service worker ---------
    this.swUpdate.available.subscribe( _ => {
      const snackBarRef = this.snackBar.open( 'Приложение было обновлено, просьба перезагрузить приложение.', 'Перезагрузить' );
      snackBarRef.onAction().subscribe( () => {
        location.reload();
      } );
    } );
  }
}
