import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  ) { }

  ngOnInit(): void {
    this.initFormLang();
    this.switchLang();
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
