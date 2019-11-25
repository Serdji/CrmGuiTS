import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';
import { IDocumentType } from '../../../../interface/idocument-type';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { IDocument } from '../../../../interface/idocument';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: [ './document.component.styl' ]
} )
export class DocumentComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public formDocument: FormGroup;
  public documentTypes: IDocumentType[];
  public documents: IDocument[];
  public isLoader: boolean = true;
  public showHide: boolean;



  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initDocumentTypes();
    this.initFormDocument();
    this.initDocuments();
    this.documentService.subjectDeleteDocuments
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.refreshTable() );
    this.documentService.subjectPutDocuments
      .pipe( untilDestroyed(this) )
      .subscribe( _ => this.refreshTable() );
  }

  private initDocumentTypes() {
    this.documentService.getDocumentTypes()
      .pipe( untilDestroyed(this) )
      .subscribe( value => this.documentTypes = value );
  }

  private initDocuments() {
    this.documentService.getDocuments( this.id )
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IDocument[] ) => {
        this.documents = value;
        this.isLoader = false;
      } );
  }

  private refreshTable() {
    timer( 100 )
      .pipe( untilDestroyed(this) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initDocuments();
      } );
  }

  private initFormDocument() {
    this.formDocument = this.fb.group( {
      documentTypeId: '',
      num: '',
      lastName: '',
      firstName: '',
      secondName: '',
      expDate: [ '', Validators.required ],
    });
  }

  private resetForm() {
    this.formDocument.reset();
    for ( const formControlName in this.formDocument.value ) {
      this.formDocument.get( `${ formControlName }` ).setErrors( null );
    }
  }

  sendFormDocument(): void {
    if ( !this.formDocument.invalid ) {
      const params = {};
      for ( const key in this.formDocument.getRawValue() ) {
        if ( this.formDocument.get( key ).value !== 'expDate' ) {
          params[ key ] = this.formDocument.get( key ).value;
        }
      }
      Object.assign( params, { customerId: this.id } );
      Object.assign( params, { expDate: moment( this.formDocument.get( 'expDate' ).value ).format( 'YYYY-MM-DD' ) } );
      console.log( params );
      this.documentService.addDocument( params )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => {
          this.windowDialog( 'DIALOG.OK.DOCUMENT_CHANGED', 'ok' );
          this.resetForm();
          this.refreshTable();
        } );
    }
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.id,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed(this) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  showHiden(): void {
    this.showHide = !this.showHide;
  }

  ngOnDestroy(): void {}

}
