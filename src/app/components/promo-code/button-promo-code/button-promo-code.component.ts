import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPromoCodeComponent } from '../dialog-promo-code/dialog-promo-code.component';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-button-promo-code',
  templateUrl: './button-promo-code.component.html',
  styleUrls: [ './button-promo-code.component.styl' ]
} )
export class ButtonPromoCodeComponent implements OnDestroy, OnInit {

  @Input() ids: any;
  @Input() disabled: boolean;




  constructor(
    public dialog: MatDialog,
  ) { }

  openDialog(): void {
    this.dialog.open( DialogPromoCodeComponent, {
      width: '80vw',
      data: {
        params: this.ids,
      }
    } );
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {}

}
