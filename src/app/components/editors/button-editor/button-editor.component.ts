import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditorComponent } from '../dialog-editor/dialog-editor.component';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

@Component( {
  selector: 'app-button-editor',
  templateUrl: './button-editor.component.html',
  styleUrls: [ './button-editor.component.styl' ]
} )
export class ButtonEditorComponent implements OnInit, OnDestroy {

  @Input() ids: any;
  @Input() disabled: boolean;
  @Input() totalCount: number;
  @Input() whatNewsletter: string;

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
      _.has( this.ids, 'customerGroupIds' )
    ) {
      this.dialog.open( DialogEditorComponent, {
        data: {
          params: this.ids,
          totalCount: _.size( this.ids.customerIds || this.ids.customerGroupIds ),
          whatNewsletter: this.whatNewsletter
        }
      } );
    } else {
      this.route.queryParams
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( value => {
          if ( _.has( value, 'segmentationId' ) ) {
            this.dialog.open( DialogEditorComponent, {
              data: {
                params: { 'segmentationIds': [ value.segmentationId ] },
                totalCount: this.totalCount,
                whatNewsletter: this.whatNewsletter
              }
            } );
          } else {
            this.dialog.open( DialogEditorComponent, {
              data: {
                params: value,
                totalCount: this.totalCount,
                whatNewsletter: this.whatNewsletter
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
