import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';

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
    const messDialog = `После перезагрузки приложение все ваши настройки будут установлены по умолчанию. Вы действительно хотите перезагрузить приложения?`;
    this.windowDialog( messDialog, 'delete', 'restart' );
  }

}
