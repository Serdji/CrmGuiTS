import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxWigToolbarService } from 'ngx-wig';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { EditorService } from './editor.service';
import { IDistributionPlaceholder } from '../../../interface/idistribution-placeholder';
import { ITemplates } from '../../../interface/itemplates';
import { ITemplate } from '../../../interface/itemplate';

@Component( {
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.styl' ]
} )
export class EditorComponent implements OnInit, OnDestroy {

  @Input() params: any;

  public distribution: FormGroup;
  public distributionPlaceholders: IDistributionPlaceholder[];
  public templates: ITemplates[];
  public template: ITemplate;

  private isActive: boolean;


  constructor(
    private ngxWigToolbarService: NgxWigToolbarService,
    private fb: FormBuilder,
    private editorService: EditorService
  ) {}

  ngOnInit(): void {
    this.isActive = true;
    this.initForm();
    this.initDistributionPlaceholder();
    this.initTemplates();
    this.insertTemplate();
  }

  private initForm() {
    this.distribution = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: '',
      footer: [ '', [ Validators.required ] ],
      templateId: '',
    }, {
      updateOn: 'submit',
    } );
  }

  private insertTemplate() {
    this.distribution.get( 'templateId' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.distribution.get( 'text' ).patchValue( '' );
        if ( value ) {
          this.editorService.getTemplate( value )
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( ( template: ITemplate ) => {
              this.distribution.get( 'text' ).patchValue( template.htmlBody );
            } );
        }
      } );
  }

  private initTemplates() {
    this.editorService.getTemplates()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( templates: ITemplates[] ) => {
        this.templates = templates;
      } );
  }

  private initDistributionPlaceholder() {
    this.editorService.getDistributionPlaceholder()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.distributionPlaceholders = value;
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


  sendDistribution(): void {
    const newParams = _( this.distribution.getRawValue() ).merge( this.params ).value();
    this.editorService.setDistribution( newParams )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
