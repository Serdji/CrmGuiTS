import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { SaveUrlServiceService } from './services/save-url-service.service';
import { TitleService } from './services/title.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {  MomentDateAdapter } from '@angular/material-moment-adapter';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD MM YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ] },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-ru' },
  ],
} )
export class AppComponent implements OnInit {


  constructor(
    private router: Router,
    private location: Location,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private saveUrlServiceService: SaveUrlServiceService,
    private titleService: TitleService,
  ) { }

  ngOnInit(): void {
    this.saveUrlServiceService.saveUrl();
    this.isTokenRedirect();
    this.updateVersion();
    this.saveUrlServiceService.deleteLocalStorageParams();

    this.titleService.dataTitle();
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
