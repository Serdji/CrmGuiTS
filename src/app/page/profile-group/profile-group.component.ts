import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileGroupService } from './profile-group.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { IprofileGroup } from '../../interface/iprofile-group';

@Component( {
  selector: 'app-profile-group',
  templateUrl: './profile-group.component.html',
  styleUrls: [ './profile-group.component.styl' ]
} )
export class ProfileGroupComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  private isLoader: boolean;

  public formNameProfileGroup: FormGroup;
  public profileGroup: IprofileGroup[];

  constructor(
    private fb: FormBuilder,
    private profileGroupService: ProfileGroupService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initForm();
    this.initTable();
  }

  private initForm() {
    this.formNameProfileGroup = this.fb.group( {
      'CustomerGroupName': ''
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
