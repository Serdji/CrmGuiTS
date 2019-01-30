import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxWigToolbarService } from 'ngx-wig';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EditorService } from './editor.service';
import { IDistributionPlaceholder } from '../../../interface/idistribution-placeholder';
import { ITemplates } from '../../../interface/itemplates';
import { ITemplate } from '../../../interface/itemplate';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.styl' ]
} )
export class EditorComponent implements OnInit, OnDestroy {

  @Input() params: any;
  @Input() totalCount: number;

  public formDistribution: FormGroup;
  public distributionPlaceholders: IDistributionPlaceholder[];
  public templates: ITemplates[];
  public template: ITemplate;
  public buttonSave: boolean;

  private distributionId: number;
  private isActive: boolean;
  private emailLimits: number;


  constructor(
    private ngxWigToolbarService: NgxWigToolbarService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private editorService: EditorService,
    private router: Router,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.isActive = true;
    this.buttonSave = false;
    this.initForm();
    this.initDistributionPlaceholders();
    this.initTemplates();
    this.insertTemplate();
  }

  private initForm() {
    this.formDistribution = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: '',
      templateId: '',
      dateFrom: '',
      dateTo: '',
      totalCount: '',
      emailLimits: '',
    }, {
      updateOn: 'submit',
    } );
    this.formFilling();
  }

  private initTemplates() {
    this.editorService.getTemplates()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( templates: ITemplates[] ) => {
        this.templates = templates;
      } );
  }

  private initDistributionPlaceholders() {
    this.editorService.getDistributionPlaceholders()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.distributionPlaceholders = value;
      } );
  }

  private resetForm() {
    this.formDistribution.reset();
    for ( const formControlName in this.formDistribution.value ) {
      this.formDistribution.get( `${ formControlName }` ).setErrors( null );
    }
  }

  private formFilling() {
    this.formDistribution.get( 'dateFrom' ).patchValue( moment().format() );
    this.formDistribution.get( 'dateTo' ).patchValue( moment().add(1, 'days').format() );
    this.formDistribution.get( 'totalCount' ).patchValue( this.totalCount );
    this.formDistribution.get( 'totalCount' ).disable();
    this.editorService.getEmailLimits()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( emailLimits => {
        this.emailLimits = emailLimits;
        this.formDistribution.get( 'emailLimits' ).patchValue( emailLimits );
        this.formDistribution.get( 'emailLimits' ).disable();
      } );
  }

  private insertTemplate() {
    this.formDistribution.get( 'templateId' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.formDistribution.get( 'text' ).patchValue( '' );
        if ( value ) {
          this.editorService.getTemplate( value )
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( ( template: ITemplate ) => {
              this.formDistribution.get( 'text' ).patchValue( template.htmlBody );
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  saveDistribution(): void {

    const editorRes = this.elRef.nativeElement.querySelector('.nw-editor__res');

    const newParams = _( this.formDistribution.getRawValue() )
      .merge( this.params )
      .omit( [ 'templateId', 'totalCount', 'emailLimits', 'count', 'from' ] )
      .set( 'dateFrom', this.formDistribution.get( 'dateFrom' ).value ? moment( this.formDistribution.get( 'dateFrom' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '' )
      .set( 'dateTo', this.formDistribution.get( 'dateTo' ).value ? moment( this.formDistribution.get( 'dateTo' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '' )
      .set( 'text', editorRes.innerHTML )
      .value();

    if ( !this.formDistribution.invalid ) {
      this.buttonSave = true;
      this.editorService.saveDistribution( newParams )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe(
          value => {
            this.distributionId = value.distributionId;
            this.dialog.closeAll();
            this.router.navigate( [ `/crm/profile-distribution/${value.distributionId}` ] );
          },
          _ => this.windowDialog( 'Ошибка при отправки', 'error' )
        );
    } else {
      this.windowDialog( 'Не все поля заполнены', 'error' );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}