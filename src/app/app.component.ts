import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { SaveUrlServiceService } from './services/save-url-service.service';
import { TitleService } from './services/title.service';
import { TranslateService } from '@ngx-translate/core';

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
    private saveUrlServiceService: SaveUrlServiceService,
    private titleService: TitleService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.saveUrlServiceService.saveUrl();
    this.isTokenRedirect();
    this.updateVersion();
    this.saveUrlServiceService.deleteLocalStorageParams();
    this.titleService.dataTitle();
    this.initTranslate();
  }

  private initTranslate() {
    this.translate.addLangs(['ru', 'en']);
    this.translate.setDefaultLang('ru');

    this.translate.stream('MENU').subscribe((value) => console.log(value, this.translate.store.currentLang ));

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/ru|en/) ? browserLang : 'ru');
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
