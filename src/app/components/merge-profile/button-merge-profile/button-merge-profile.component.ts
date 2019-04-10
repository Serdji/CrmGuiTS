import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogMergeProfileComponent } from '../dialog-merge-profile/dialog-merge-profile.component';

@Component({
  selector: 'app-button-merge-profile',
  templateUrl: './button-merge-profile.component.html',
  styleUrls: ['./button-merge-profile.component.styl']
})
export class ButtonMergeProfileComponent implements OnInit {

  @Input() ids: any;
  @Input() disabled: boolean;

  private isActive: boolean;


  constructor(
    public dialog: MatDialog,
  ) { }

  openDialog(): void {
    this.dialog.open( DialogMergeProfileComponent, {
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
