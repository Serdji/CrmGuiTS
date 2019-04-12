import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { takeWhile } from 'rxjs/operators';
import { ProfileSearchService } from '../../../page/profiles/profile-search/profile-search.service';
import { Iprofiles } from '../../../interface/iprofiles';
import * as R from 'ramda';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DialogMergeProfileService } from './dialog-merge-profile.service';

@Component( {
  selector: 'app-dialog-merge-profile',
  templateUrl: './dialog-merge-profile.component.html',
  styleUrls: [ './dialog-merge-profile.component.styl' ]
} )
export class DialogMergeProfileComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  private profiles: Iprofiles[] = [];

  constructor(
    private dialog: MatDialog,
    private profileSearchService: ProfileSearchService,
    private dialogMergeProfileService: DialogMergeProfileService,
    public dialogRef: MatDialogRef<DialogMergeProfileComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initProfiles();
  }

  private initProfiles() {
    const success = profile => this.profiles.push( profile );
    const objParams = id => {
      return {
        customerids: id,
        sortvalue: 'last_name',
        from: 0,
        count: 10
      };
    };
    const mapIds = customerIds => {
      this.profileSearchService.getProfileSearch( objParams( customerIds ) )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( success );
    };
    const profilePush = R.map( mapIds );

    profilePush( this.data.params.customerIds );
  }

  drop( event: CdkDragDrop<string[]> ) {
    moveItemInArray( this.profiles, event.previousIndex, event.currentIndex );
  }

  private paramMergeCustomer() {
    const propCustomerId = R.prop( 'customerId' );
    const funcMapProfiles = profile => propCustomerId( R.head( profile.result ) );
    const mapProfiles = R.map( funcMapProfiles );
    const arrCustomerIds = mapProfiles( this.profiles );

    return {
      MainCustomerId: R.head( arrCustomerIds ),
      CustomerIds: R.tail( arrCustomerIds )
    };
  }

  onYesClick(): void {
    console.log( this.paramMergeCustomer() );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
