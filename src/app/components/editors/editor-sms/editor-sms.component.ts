import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorSmsService } from './editor-sms.service';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { ITemplate } from '../../../interface/itemplate';
import * as R from 'ramda';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { Observable, of, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditorService } from '../editor.service';
import * as _ from 'lodash';
import { ITemplates } from '../../../interface/itemplates';


import { untilDestroyed } from 'ngx-take-until-destroy';
import { DistributionTopicService } from '../../../page/distribution/distribution-topic/distribution-topic.service';
import { IDistributionTopic } from '../../../interface/idistribution-topic';

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
  public templates$: Observable<ITemplates[]>;
  public distSubjects$: Observable<IDistributionTopic[]>;
  public template: ITemplate;
  public counter: {
    color: string;
    size: number;
    counterSms: number;
    oneSizeSms: number;
    nexStep: number;
  } = {
    color: 'rgba(0, 0, 0, 0.54)',
    size: 0,
    counterSms: 1,
    oneSizeSms: 64,
    nexStep: 64,
  };


  private distributionId: number;


  constructor(
    private editorSmsService: EditorSmsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private editorService: EditorService,
    private distributionTopicService: DistributionTopicService,
  ) { }

  ngOnInit(): void {
    this.buttonDisabled = true;
    this.initFormSms();
    this.insertTemplate();
    this.initIsButtonSave();
    this.formFilling();
    this.initTemplates();
    this.initDistSubject();
    this.initCounterSms();
  }

  private formFilling() {
    if ( this.params.task ) {
      this.formSms.get( 'subject' ).patchValue( this.params.task.subject );
      this.formSms.get( 'distSubjectId' ).patchValue( this.params.task.distSubjectId );
      this.formSms.get( 'text' ).patchValue( this.params.task.distributionTemplate );
    }
  }

  private initFormSms() {
    this.formSms = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: [ '', [ Validators.required ] ],
      templateId: '',
      distSubjectId: ''
    } );
    this.newParams();
  }

  private initTemplates() {
    this.templates$ =  this.editorSmsService.getTemplates();
  }

  private initDistSubject() {
    this.distSubjects$ = this.distributionTopicService.getAllDistributionSubjects() as Observable<IDistributionTopic[]>;
  }

  private insertTemplate() {
    this.formSms.get( 'templateId' ).valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.formSms.get( 'text' ).patchValue( '' );
        if ( value ) {
          this.editorService.getTemplate( value )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( template: ITemplate ) => {
              this.formSms.get( 'text' ).patchValue( template.text );
            } );
        }
      } );
  }

  private initIsButtonSave() {
    this.formSms.valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.buttonDisabled = this.formSms.invalid );
  }

  private counterSmsFn(
    counterSms: number,
    size: number,
    oneSizeSms: number = this.counter.oneSizeSms,
    nexStep: number = this.counter.oneSizeSms,
    defaultCounterSms:  { counterSms: number, nexStep: number } = { counterSms: 1, nexStep: this.counter.oneSizeSms }
  ): { counterSms: number, nexStep: number } {
    return oneSizeSms > size ? defaultCounterSms :
      nexStep <= size ? this.counterSmsFn( (( nexStep + oneSizeSms ) / oneSizeSms), size, oneSizeSms, nexStep + oneSizeSms ) :
        { counterSms, nexStep };
  }

  private initCounterSms() {
    this.formSms.get( 'text' ).valueChanges
      .pipe(
        map( ( value: any ) => {
          return {
            oneSizeSms: this.counter.oneSizeSms,
            size: value.length,
            color: value.length >= this.counter.oneSizeSms ? '#f44336' : 'rgba(0, 0, 0, 0.54)',
            ...this.counterSmsFn( this.counter.counterSms, value.length ),
          };
        } )
      ).subscribe( counter => this.counter = counter );
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
        .pipe( untilDestroyed( this ) )
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
        this.router.navigate( [ `/crm/profile-sms-distribution/${value.distributionId}` ] );
      };
      const error = _ => this.windowDialog( 'DIALOG.ERROR.ERROR_SENDING', 'error' );

      const saveDistribution = params => this.editorService.saveDistribution( params )
        .pipe( untilDestroyed( this ) )
        .subscribe( success, error );
      const saveFromPromoCode = params => this.editorService.saveFromPromoCode( params )
        .pipe( untilDestroyed( this ) )
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

  ngOnDestroy(): void {}
}
