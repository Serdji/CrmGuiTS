import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogPromoCodComponent } from '../dialog-promo-cod/dialog-promo-cod.component';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component( {
  selector: 'app-button-promo-cod',
  templateUrl: './button-promo-cod.component.html',
  styleUrls: [ './button-promo-cod.component.styl' ]
} )
export class ButtonPromoCodComponent implements OnDestroy, OnInit {

  @Input() ids: any;
  @Input() disabled: boolean;

  private isActive: boolean;


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  openDialog(): void {
    this.dialog.open( DialogPromoCodComponent, {
      width: '80vw',
      data: {
        params: this.ids,
      }
    } );
  }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
