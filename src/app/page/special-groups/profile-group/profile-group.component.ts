import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileGroupService } from './profile-group.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-profile-group',
  templateUrl: './profile-group.component.html',
  styleUrls: [ './profile-group.component.styl' ]
} )
export class ProfileGroupComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  public isLoader: boolean;
  public formNameProfileGroup: FormGroup;
  public profileGroup: IcustomerGroup[];

  constructor(
    private fb: FormBuilder,
    private profileGroupService: ProfileGroupService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initForm();
    this.initTable();
    this.profileGroupService.subjectDeleteProfileGroups
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshTable() );
  }

  private initForm() {
    this.formNameProfileGroup = this.fb.group( {
      'CustomerGroupName': ''
    } );
  }

  private refreshTable() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initTable();
      } );
  }

  private initTable() {
    this.profileGroupService.getProfileGroup()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.profileGroup = value;
        this.isLoader = false;
      } );
  }

  private resetForm() {
    _( this.formNameProfileGroup.value ).each( ( value, key ) => {
      this.formNameProfileGroup.get( key ).patchValue( '' );
      this.formNameProfileGroup.get( key ).setErrors( null );
    } );
  }

  saveForm(): void {
    const params = this.formNameProfileGroup.getRawValue();
    this.profileGroupService.addProfileGroup( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( () => {
        this.isLoader = true;
        this.resetForm();
        this.initTable();
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
