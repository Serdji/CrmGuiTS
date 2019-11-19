import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxWigToolbarService } from 'ngx-wig';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IDistributionPlaceholder } from '../../../interface/idistribution-placeholder';
import { ITemplates } from '../../../interface/itemplates';
import { ITemplate } from '../../../interface/itemplate';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as R from 'ramda';
import { EditorEmailService } from './editor-email.service';
import { EditorService } from '../editor.service';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';


@Component( {
  selector: 'app-editor-email',
  templateUrl: './editor-email.component.html',
  styleUrls: [ './editor-email.component.styl' ],
} )
export class EditorEmailComponent implements OnInit, OnDestroy {

  @Input() params: any;
  @Input() totalCount: number;
  @Input() whichButton: string;

  @Output() private messageEvent = new EventEmitter();

  public formDistribution: FormGroup;
  public distributionPlaceholders: IDistributionPlaceholder[];
  public templates: ITemplates[];
  public template: ITemplate;
  public buttonDisabled: boolean;

  private distributionId: number;

  private emailLimits: number;


  constructor(
    private ngxWigToolbarService: NgxWigToolbarService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private editorEmailService: EditorEmailService,
    private editorService: EditorService,
    private router: Router,
    private elRef: ElementRef,
    private dateTimeAdapter: DateTimeAdapter<any>,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.buttonDisabled = true;
    this.initForm();
    this.initDistributionPlaceholders();
    this.initTemplates();
    this.insertTemplate();
    this.initIsButtonSave();
    this.translate.stream( 'MENU' ).subscribe( _ => {
      this.dateTimeAdapter.setLocale( this.translate.store.currentLang );
    } );
  }

  private initIsButtonSave() {
    this.formDistribution.valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.buttonDisabled = this.formDistribution.invalid );
  }

  private initForm() {
    this.formDistribution = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: [ '', [ Validators.required ] ],
      templateId: '',
      dateFrom: '',
      dateTo: '',
      totalCount: '',
      emailLimits: '',
    } );
    this.formFilling();
  }

  private initTemplates() {
    this.editorEmailService.getTemplates()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( templates: ITemplates[] ) => {
        this.templates = templates;
      } );
  }

  private initDistributionPlaceholders() {
    this.editorEmailService.getDistributionPlaceholders()
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.distributionPlaceholders = value;
      } );
  }

  private resetForm() {
    this.formDistribution.reset();
    for ( const formControlName in this.formDistribution.value ) {
      this.formDistribution.get( `${formControlName}` ).setErrors( null );
    }
  }

  private formFilling() {
    if ( this.params.task ) {
      this.formDistribution.get( 'subject' ).patchValue( this.params.task.subject );
      this.formDistribution.get( 'text' ).patchValue( this.params.task.distributionTemplate );
    }
    this.formDistribution.get( 'dateFrom' ).patchValue( moment().format() );
    this.formDistribution.get( 'dateTo' ).patchValue( moment().add( { days: 1, hour: 23 } ).format() );
    this.formDistribution.get( 'totalCount' ).patchValue( this.totalCount );
    this.formDistribution.get( 'totalCount' ).disable();
    this.editorEmailService.getEmailLimits()
      .pipe( untilDestroyed( this ) )
      .subscribe( emailLimits => {
        this.emailLimits = emailLimits;
        this.formDistribution.get( 'emailLimits' ).patchValue( emailLimits );
        this.formDistribution.get( 'emailLimits' ).disable();
      } );
  }

  private insertTemplate() {
    this.formDistribution.get( 'templateId' ).valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.formDistribution.get( 'text' ).patchValue( '' );
        if ( value ) {
          this.editorService.getTemplate( value )
            .pipe( untilDestroyed( this ) )
            .subscribe( ( template: ITemplate ) => {
              this.formDistribution.get( 'text' ).patchValue( template.text );
            } );
        }
      } );
  }

  sendVarPlaceholder( params: string ): void {
    const val = `{{ ${params} }}`;
    let sel, range;

    if ( window.getSelection ) {
      sel = window.getSelection();

      if ( sel.getRangeAt && sel.rangeCount ) {
        range = sel.getRangeAt( 0 );
        range.deleteContents();

        // append the content in a temporary div
        const el = document.createElement( 'div' );
        el.innerHTML = val;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ( ( node = el.firstChild ) ) {
          lastNode = frag.appendChild( node );
        }

        if ( range.startContainer.parentNode.closest( '.nw-editor' ) ) {
          range.insertNode( frag );

          // Preserve the selection
          if ( lastNode ) {
            range = range.cloneRange();
            range.setStartAfter( lastNode );
            range.collapse( true );
            sel.removeAllRanges();
            sel.addRange( range );
          }
        }
      }
    }
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
      this.resetForm();
      timer( 1500 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  private newParams = () => _( this.formDistribution.getRawValue() )
    .merge( this.params )
    .omit( [ 'templateId', 'totalCount', 'emailLimits', 'count', 'from' ] )
    .set( 'dateFrom', this.formDistribution.get( 'dateFrom' ).value ? moment( this.formDistribution.get( 'dateFrom' ).value ).format( 'YYYY-MM-DDTHH:mm:ss' ) : '' )
    .set( 'dateTo', this.formDistribution.get( 'dateTo' ).value ? moment( this.formDistribution.get( 'dateTo' ).value ).format( 'YYYY-MM-DDTHH:mm:ss' ) : '' )
    .set( 'text', this.elRef.nativeElement.querySelector( '.nw-editor__res' ).innerHTML )
    .set( 'distributionType', 1 )
    .value();

  saveDistribution(): void {

    if ( !this.formDistribution.invalid ) {
      const success = value => {
        this.distributionId = value.distributionId;
        this.dialog.closeAll();
        this.router.navigate( [ `/crm/profile-email-distribution/${value.distributionId}` ] );
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
