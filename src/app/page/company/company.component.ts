import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyService } from './company.service';
import { Iairlines } from '../../interface/iairlines';
import { takeWhile } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { timer } from 'rxjs/observable/timer';

@Component( {
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: [ './company.component.styl' ],
} )
export class CompanyComponent implements OnInit, OnDestroy {

  public airlines: any;
  public isLoader: boolean = true;
  public formCompany: FormGroup;
  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initAirline();
    this.initForm();
  }

  initForm() {
    this.formCompany = this.fb.group( {
      AirlineCode: [ '' ],
      AirlineName: [ '' ],
      Description: [ '' ],
      ConnectionString: [ '' ],
      UserTable: [ '' ],
      RoleTable: [ '' ],
      UserRoleTable: [ '' ],
      UserLoginTable: [ '' ],
      IdentityDb: [ '' ],
    }, {
      updateOn: 'submit',
    } );
  }

  private initAirline() {
    this.companyService.getAirlines()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( airlines: Iairlines ) => {
        this.airlines = airlines.Data.Airlines;
        this.isLoader = false;
      } );
  }

  private resetForm() {
    this.formCompany.reset();
    for ( const formControlName in this.formCompany.value ) {
      this.formCompany.get( `${ formControlName }` ).setErrors( null );
    }
  }

  sendForm(): void {
    if (! this.formCompany.invalid) {
      this.companyService.createCompany(this.formCompany.getRawValue())
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( (value: any) => {
          console.log(value);
          if ( value.Data.ErrorMsg ) {
            this.dialog.open( DialogComponent, {
              data: {
                message: value.Data.ErrorMsg,
                status: 'error',
              },
            } );
          }
          timer( 1500 ).subscribe( _ => this.dialog.closeAll() );
        });
    }
  }

  clearForm(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
