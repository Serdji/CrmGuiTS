import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogMergeProfileComponent } from '../dialog-merge-profile/dialog-merge-profile.component';
import { ProfileSearchService } from '../../../page/profiles/profile-search/profile-search.service';
import { Iprofiles } from '../../../interface/iprofiles';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-button-merge-profile',
  templateUrl: './button-merge-profile.component.html',
  styleUrls: ['./button-merge-profile.component.styl']
})
export class ButtonMergeProfileComponent implements OnInit, OnDestroy {

  @Input() ids: any;
  @Input() disabled: boolean;

  private isActive: boolean;


  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
  }

  openDialog(): void {
    this.dialog.open( DialogMergeProfileComponent, {
      width: '40vw',
      data: {
        params: this.ids,
      }
    } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }


}
