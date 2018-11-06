import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogEditorComponent } from '../dialog-editor/dialog-editor.component';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

@Component( {
  selector: 'app-button-editor',
  templateUrl: './button-editor.component.html',
  styleUrls: [ './button-editor.component.styl' ]
} )
export class ButtonEditorComponent implements OnInit, OnDestroy, OnInit {

  @Input() ids: number[];
  @Input() disabled: boolean;

  private isActive: boolean;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
  }

  openDialog(): void {
    if (
      _.has( this.ids, 'customerIds' ) ||
      _.has( this.ids, 'profileGroupIds' )
    ) {
      this.dialog.open( DialogEditorComponent, {
        width: '80vw',
        data: {
          params: this.ids
        }
      } );
    } else {
      this.route.queryParams
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( value => {
          if ( _.has( value, 'segmentationId' ) ) {
            this.dialog.open( DialogEditorComponent, {
              width: '80vw',
              data: {
                params: { 'segmentationIds': [ value.segmentationId ] }
              }
            } );
          } else {
            this.dialog.open( DialogEditorComponent, {
              width: '80vw',
              data: {
                params: value
              }
            } );
          }
        } );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
