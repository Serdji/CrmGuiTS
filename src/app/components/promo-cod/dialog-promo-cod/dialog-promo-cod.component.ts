import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddPromotionsCodsService } from '../../../page/promotions/add-promotions-cods/add-promotions-cods.service';
import { IPromoCod } from '../../../interface/ipromo-cod';
import { delay, map, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DialogPromoCodService } from './dialog-promo-cod.service';

@Component( {
  selector: 'app-dialog-promo-cod',
  templateUrl: './dialog-promo-cod.component.html',
  styleUrls: [ './dialog-promo-cod.component.styl' ]
} )
export class DialogPromoCodComponent implements OnInit, OnDestroy {

  public promoCods: IPromoCod;
  public formPromoCod: FormGroup;
  public promoCodsOptions: Observable<IPromoCod>;

  private isActive: boolean;
  private autDelay: number;

  constructor(
    private fb: FormBuilder,
    private addPromotionsCodsService: AddPromotionsCodsService,
    private dialogPromoCodService: DialogPromoCodService,
    public dialogRef: MatDialogRef<DialogPromoCodComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any
  ) { }

  ngOnInit(): void {
    console.log( this.data.params );
    this.isActive = true;
    this.autDelay = 500;
    this.initForm();
    this.initPromoCods();
    this.initAutocomplete();
  }

  private initPromoCods() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsCodsService.getAllPromoCodes( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCods: IPromoCod ) => this.promoCods = promoCods );
  }

  private initForm() {
    this.formPromoCod = this.fb.group( {
      promoCodeId: '',
    } );
  }

  private initAutocomplete() {
    this.promoCodsOptions = this.autocomplete( 'promoCodeId', 'promoCode' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formPromoCod.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promoCode':
              return this.promoCods.result.filter( promoCods => promoCods.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
          }
        } )
      );
  }

  saveForm(): void {
    const params = {
      promoCodeId: this.formPromoCod.get( 'promoCodeId' ).value,
      customerIds: this.data.params.customerIds,
    };
    if ( !this.formPromoCod.invalid ) {
      this.dialogPromoCodService.savePromoCodeCustomers( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
