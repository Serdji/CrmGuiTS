import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxWigToolbarService } from 'ngx-wig';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { EditorService } from './editor.service';

@Component( {
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.styl' ]
} )
export class EditorComponent implements OnInit, OnDestroy {

  @Input() params: any;

  public distribution: FormGroup;

  private isActive: boolean;


  constructor(
    private ngxWigToolbarService: NgxWigToolbarService,
    private fb: FormBuilder,
    private editorService: EditorService
  ) {
  }

  ngOnInit(): void {
    this.isActive = true;
    this.initForm();

  }

  private initForm() {
    this.distribution = this.fb.group( {
      subject: [ '', [ Validators.required ] ],
      text: '',
      footer: [ '', [ Validators.required ] ],
    }, {
      updateOn: 'submit',
    } );
  }

  sendDistribution(): void {
    let newParams;
    newParams = _.merge( this.distribution.getRawValue(), this.params );
    this.editorService.setDistribution( newParams )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => console.log( value ) );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
