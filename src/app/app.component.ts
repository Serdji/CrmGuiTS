import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { SaveUrlServiceService } from './services/save-url-service.service';
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
    private saveUrlServiceService: SaveUrlServiceService
  ) { }

  ngOnInit(): void {
    this.saveUrlServiceService.saveUrl();
    this.isTokenRedirect();
    this.updateVersion();
    this.saveUrlServiceService.deleteLocalStorageParams();
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
