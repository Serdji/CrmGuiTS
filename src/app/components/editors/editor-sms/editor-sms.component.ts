import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorSmsService } from './editor-sms.service';
import { takeWhile } from 'rxjs/operators';
import { ITemplate } from '../../../interface/itemplate';


@Component({
  selector: 'app-editor-sms',
  templateUrl: './editor-sms.component.html',
  styleUrls: ['./editor-sms.component.styl']
})
export class EditorSmsComponent implements OnInit, OnDestroy {

  @Input() params: any;
  @Input() totalCount: number;
  @Input() whichButton: string;

  @Output() private messageEvent = new EventEmitter();

  public formSms: FormGroup;

  private isActive: boolean;


  constructor(
    private editorSmsService: EditorSmsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initFormSms();
    this.insertTemplate();
  }

  private initFormSms() {
    this.formSms = this.fb.group({
      title: '',
      text: '',
      templateId: ''
    });
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
    this.messageEvent.emit( '' );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
