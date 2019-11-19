import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-restart',
  templateUrl: './restart.component.html',
  styleUrls: [ './restart.component.styl' ]
} )
export class RestartComponent implements OnInit {

  constructor( private dialog: MatDialog ) { }

  ngOnInit() {
  }

  private windowDialog( messDialog: string, params: string, card: string = '' ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        card,
      },
    } );
  }

  restart(): void {
    this.windowDialog( 'DIALOG.DELETE.SETTING_DEFAULT', 'delete', 'restart' );
  }

}
