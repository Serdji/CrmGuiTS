import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

@Component( {
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: [ './document.component.styl' ]
} )
export class DocumentComponent implements OnInit, OnDestroy {

  @Input() id: number;

  private isActive: boolean = true;

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
