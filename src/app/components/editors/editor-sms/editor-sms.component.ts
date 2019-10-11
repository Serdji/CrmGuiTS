import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorSmsService } from './editor-sms.service';
import { takeWhile } from 'rxjs/operators';
import { ITemplate } from '../../../interface/itemplate';
import * as R from 'ramda';
import * as moment from 'moment';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditorService } from '../editor.service';
import * as _ from 'lodash';


@Component( {
  selector: 'app-editor-sms',
  templateUrl: './editor-sms.component.html',
  styleUrls: [ './editor-sms.component.styl' ]
} )
export class EditorSmsComponent implements OnInit, OnDestroy {

  @Input() params: any;
  @Input() totalCount: number;
  @Input() whichButton: string;

  @Output() private messageEvent = new EventEmitter();

  public formSms: FormGroup;
  public buttonDisabled: boolean;

  private isActive: boolean;
  private distributionId: number;


  constructor(
    private editorSmsService: EditorSmsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private editorService: EditorService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.buttonDisabled = true;
    this.initFormSms();
    this.insertTemplate();
    this.initIsButtonSave();
    this.formFilling();
  }

  private formFilling() {
    if( this.params.task ) {
      this.formSms.get( 'subject' ).patchValue( this.params.task.subject );
      this.formSms.get( 'text' ).patchValue( this.params.task.distributionTemplate );
    }
  }

  private initFormSms() {
    this.formSms = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: [ '', [ Validators.required ] ],
      templateId: ''
    } );
    this.newParams();
  }

  private initIsButtonSave() {
    this.formSms.valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.buttonDisabled = this.formSms.invalid );
  }

  private insertTemplate() {
    this.formSms.get( 'templateId' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formSms.get( 'text' ).patchValue( '' );
        if ( value ) {
          this.formSms.get( 'text' ).patchValue( value );
        }
      } );
  }


  private windowDialog( messDialog: string, status: string, params: any = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status,
        card: status,
        params
      },
    } );
    if ( status === 'ok' ) {
      this.formSms.reset();
      timer( 1500 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  private newParams = () => _( this.formSms.getRawValue() )
    .merge( this.params )
    .omit( [ 'templateId', 'totalCount', 'emailLimits', 'count', 'from' ] )
    .set( 'distributionType', 2 )
    .value();

  saveDistribution(): void {

    if ( !this.formSms.invalid ) {
      const success = value => {
        this.distributionId = value.distributionId;
        this.dialog.closeAll();
        // this.router.navigate( [ `/crm/profile-distribution/${value.distributionId}` ] );
      };
      const error = _ => this.windowDialog( 'DIALOG.ERROR.ERROR_SENDING', 'error' );

      const saveDistribution = params => this.editorService.saveDistribution( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( success, error );
      const saveFromPromoCode = params => this.editorService.saveFromPromoCode( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( success, error );

      const whichMethod = R.ifElse( R.has( 'promoCodeId' ), saveFromPromoCode, saveDistribution );
      whichMethod( this.newParams() );

    } else {
      this.windowDialog( 'DIALOG.ERROR.NOT_ALL_FIELDS', 'error' );
    }
  }

  messageEventFn() {
    this.messageEvent.emit( this.newParams() );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
