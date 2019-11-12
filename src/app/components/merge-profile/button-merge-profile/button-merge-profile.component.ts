import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogMergeProfileComponent } from '../dialog-merge-profile/dialog-merge-profile.component';
import { ProfileSearchService } from '../../../page/profiles/profile-search/profile-search.service';
import { Iprofiles } from '../../../interface/iprofiles';
import { takeWhile } from 'rxjs/operators';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-button-merge-profile',
  templateUrl: './button-merge-profile.component.html',
  styleUrls: ['./button-merge-profile.component.styl']
})
export class ButtonMergeProfileComponent implements OnInit, OnDestroy {

  @Input() ids: any;
  @Input() disabled: boolean;




  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  openDialog(): void {
    this.dialog.open( DialogMergeProfileComponent, {
      width: '40vw',
      data: {
        params: this.ids,
      }
    } );
  }

  ngOnDestroy(): void {}


}
