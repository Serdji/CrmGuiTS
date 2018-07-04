import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUserService } from '../add-user/add-user.service';
import { takeWhile } from 'rxjs/operators';
import { UsersSearchService } from './users-search.service';
import { IuserSearch } from '../../interface/iuser-search';


@Component( {
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: [ './users-search.component.styl' ],
} )
export class UsersSearchComponent implements OnInit, OnDestroy {

  public users;
  public isTableCard: boolean = false;
  public isLoader: boolean = false;
  public formUserSearch: FormGroup;
  private isActive: boolean = true;



  constructor(
    private fb: FormBuilder,
    private addUserService: AddUserService,
    private usersSearchService: UsersSearchService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formUserSearch = this.fb.group( {
      UserName: [ '', [ Validators.minLength( 3 ) ] ],
      FirstName: [ '', [ Validators.minLength( 3 ) ] ],
      LastName: [ '', [ Validators.minLength( 3 ) ] ],
      Email: [ '', [] ],
    }, {
      updateOn: 'submit',
    } );
  }

  resetForm() {
    this.formUserSearch.reset();
    for ( const formControlName in this.formUserSearch.value ) {
      this.formUserSearch.get( `${ formControlName }` ).setErrors( null );
    }
  }

  sendForm(): void {

    this.isTableCard = true;
    this.isLoader = true;

    if ( !this.formUserSearch.invalid ) {
      let params = '?';
      for ( const key in this.formUserSearch.value ) {
        if ( this.formUserSearch.get( `${key}` ).value !== '' ) {
          params += `${key}=${this.formUserSearch.get( key ).value}&`;
        }
      }

      this.usersSearchService.getUserSearch( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( value: IuserSearch ) => {
          this.users = value.Data.Users;
          this.isLoader = false;
        } );
    }
  }

  clearForm(): void {
    this.resetForm();
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
