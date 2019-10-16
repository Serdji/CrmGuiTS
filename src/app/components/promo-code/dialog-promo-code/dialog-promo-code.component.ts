import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsCodesService } from '../../../page/promotions/add-promotions-codes/add-promotions-codes.service';
import { delay, map, takeWhile } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { DialogPromoCodeService } from './dialog-promo-code.service';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { IPromoCode } from '../../../interface/ipromo-code';

@Component( {
  selector: 'app-dialog-promo-code',
  templateUrl: './dialog-promo-code.component.html',
  styleUrls: [ './dialog-promo-code.component.styl' ]
} )
export class DialogPromoCodeComponent implements OnInit, OnDestroy {

  public promoCodes: IPromoCode;
  public formPromoCod: FormGroup;
  public promoCodesOptions: Observable<IPromoCode>;

  private isActive: boolean;
  private autDelay: number;

  constructor(
    private fb: FormBuilder,
    private addPromotionsCodesService: AddPromotionsCodesService,
    private dialogPromoCodeService: DialogPromoCodeService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogPromoCodeComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.autDelay = 500;
    this.initForm();
    this.initPromoCodes();
    this.initAutocomplete();
  }

  private initPromoCodes() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsCodesService.getAllPromoCodes( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodes: IPromoCode ) => this.promoCodes = promoCodes );
  }

  private initForm() {
    this.formPromoCod = this.fb.group( {
      promoCodeId: '',
    } );
  }

  private initAutocomplete() {
    this.promoCodesOptions = this.autocomplete( 'promoCodeId', 'promoCode' );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: '',
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.dialogRef.close();
          this.formPromoCod.get( 'promoCodeId' ).patchValue( '' );
        } );
    }
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formPromoCod.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promoCode':
              if ( _.size( val ) >= 3 ) return this.promoCodes.result.filter( promoCodes => promoCodes.code.toLowerCase().includes( val.toLowerCase() ) );
              break;
          }
        } )
      );
  }

  saveForm(): void {
    console.log(this.data.params);
    const params = {
      promoCodeId: _.chain( this.promoCodes.result ).find( { 'title': this.formPromoCod.get( 'promoCodeId' ).value } ).get( 'promoCodeId' ).value(),
      customersIds: this.data.params.customerIds,
    };
    if ( !this.formPromoCod.invalid ) {
      this.dialogPromoCodeService.savePromoCodeCustomers( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => this.windowDialog( `DIALOG.OK.PROMO_CODE_LINKED`, 'ok' ) );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
