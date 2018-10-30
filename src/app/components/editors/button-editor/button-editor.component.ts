import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogEditorComponent } from '../dialog-editor/dialog-editor.component';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component( {
  selector: 'app-button-editor',
  templateUrl: './button-editor.component.html',
  styleUrls: [ './button-editor.component.styl' ]
} )
export class ButtonEditorComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
  }

  openDialog(): void {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.dialog.open( DialogEditorComponent, {
          data: {
            params: value
          }
        } );
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
