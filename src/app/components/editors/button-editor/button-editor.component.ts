import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditorComponent } from '../dialog-editor/dialog-editor.component';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

import { untilDestroyed } from 'ngx-take-until-destroy';

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



  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

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
        .pipe( untilDestroyed(this) )
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
            const newValue = _.assign( {}, value );
            if ( _.has( newValue, 'customerGroupIds' ) ) {
              _.set( newValue, 'customerGroupIds', !_.isArray( newValue.customerGroupIds ) ? _.castArray( newValue.customerGroupIds ) : newValue.customerGroupIds );
            }
            this.dialog.open( DialogEditorComponent, {
              data: {
                params: newValue,
                totalCount: this.totalCount,
                whatNewsletter: this.whatNewsletter
              }
            } );
          }
        } );
    }
  }

  ngOnDestroy(): void {}

}
