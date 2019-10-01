import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorSmsService } from './editor-sms.service';
import { takeWhile } from 'rxjs/operators';
import { ITemplate } from '../../../interface/itemplate';
import * as R from 'ramda';
import * as moment from 'moment';


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


  constructor(
    private editorSmsService: EditorSmsService,
    private fb: FormBuilder,
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

  messageEventFn() {
    const newParams = R.merge( this.params, this.formSms.value );
    this.messageEvent.emit( newParams );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
