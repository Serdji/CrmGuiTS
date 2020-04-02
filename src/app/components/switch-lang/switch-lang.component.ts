import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component( {
  selector: 'app-switch-lang',
  templateUrl: './switch-lang.component.html',
  styleUrls: [ './switch-lang.component.styl' ]
} )
export class SwitchLangComponent implements OnInit {

  public formLang: FormGroup;

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
  ) { }

  ngOnInit(): void {
    this.initTranslate();
    this.initFormLang();
    this.switchLang();
  }

  private initTranslate() {
    this.translate.addLangs( [ 'ru', 'en' ] );
    this.translate.setDefaultLang( 'en' );
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = this.translate.getDefaultLang();
    const loadingLanguage = localStorage.getItem( 'language' );
    if ( loadingLanguage ) this.translate.use( loadingLanguage );
    // else this.translate.use( browserLang.match( /ru|en'/ ) ? browserLang : 'en' );
    else this.translate.use( defaultLang );

    this.translate.stream( 'MENU' ).subscribe( _ => {
      this._adapter.setLocale( this.translate.store.currentLang );
    } );
  }

  private initFormLang() {
    this.formLang = this.fb.group( {
      lang: ''
    } );
    this.translate.get( 'MENU' ).subscribe( _ => {
      this.formLang.get( 'lang' ).patchValue( this.translate.store.currentLang );
    } );
  }

  private switchLang() {
    this.formLang.get( 'lang' ).valueChanges.subscribe( ( lang: string ) => {
      localStorage.setItem( 'language', lang );
      this.translate.use( lang );
    } );
  }

}
