import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ProfileGroupService } from './profile-group.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-profile-group',
  templateUrl: './profile-group.component.html',
  styleUrls: [ './profile-group.component.styl' ]
} )
export class ProfileGroupComponent implements OnInit {

  private isActive: boolean;
  public formNameProfileGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private profileGroupService: ProfileGroupService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initForm();
  }

  private initForm() {
    this.formNameProfileGroup = this.fb.group( {
      'CustomerGroupName': ''
    } );
  }

  private resetForm() {
    _( this.formNameProfileGroup.value ).each( ( value, key ) => {
      this.formNameProfileGroup.get( key ).patchValue( '' );
      this.formNameProfileGroup.get( key ).setErrors( null );
    } );
  }
  private windowDialog( messDialog: string, params: string, disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  saveForm(): void {
    const params = this.formNameProfileGroup.getRawValue();
    this.profileGroupService.addProfileGroup( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( () => {
        this.windowDialog( `Спец группа успешно сохранена`, 'ok' );
        this.resetForm();
      } );
  }

}
