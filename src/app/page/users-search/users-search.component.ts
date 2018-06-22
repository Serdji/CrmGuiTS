import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { takeWhile } from 'rxjs/operators';
import { Iairlines } from '../../../../../Crm.GUI.Adm/src/app/interface/iairlines';
import { IuserSearch } from '../../../../../Crm.GUI.Adm/src/app/interface/iuser-search';
import { UsersSearchService } from './users-search.service';


@Component( {
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: [ './users-search.component.styl' ],
} )
export class UsersSearchComponent implements OnInit, OnDestroy {

  public users;
  public airlines: any;
  public isTableCard: boolean = false;
  public isLoader: boolean = false;
  public formUserSearch: FormGroup;
  private isActive: boolean = true;



  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private usersSearchService: UsersSearchService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initAirline();
  }

  private initAirline() {
    this.usersService.getAirlines()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( airlines: Iairlines ) => {
        this.airlines = airlines.Data.Airlines;
      } );
  }

  private initForm() {
    this.formUserSearch = this.fb.group( {
      UserName: [ '', [ Validators.minLength( 3 ) ] ],
      FirstName: [ '', [ Validators.minLength( 3 ) ] ],
      LastName: [ '', [ Validators.minLength( 3 ) ] ],
      Email: [ '', [] ],
      AirlineCode: [ '', [ Validators.required ] ],
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
