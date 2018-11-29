import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { delay, map, takeWhile } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Ilocation } from '../../../interface/ilocation';
import { AddPromotionsService } from '../add-promotions/add-promotions.service';
import { IPromotions } from '../../../interface/ipromotions';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component( {
  selector: 'app-add-promotions-cods',
  templateUrl: './add-promotions-cods.component.html',
  styleUrls: [ './add-promotions-cods.component.styl' ]
} )
export class AddPromotionsCodsComponent implements OnInit, OnDestroy {

  public isLoader: boolean;
  public formPromoCods: FormGroup;
  public locations: Ilocation[];
  public promotions: IPromotions;
  public promotionsOptions: Observable<Ilocation[]>;
  public locationToOptions: Observable<Ilocation[]>;

  private isActive: boolean;
  private autDelay: number = 500;

  // @ViewChild( 'segmentationChipInput' ) segmentationFruitInput: ElementRef<HTMLInputElement>;
  // @ViewChild( 'customerGroupChipInput' ) customerGroupFruitInput: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private addPromotionsService: AddPromotionsService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initFormPromoCods();
    this.initAutocomplete();
    this.initPromotions();
  }

  private initPromotions() {
    const params = {
      from: 0,
      count: 10000
    };
    this.addPromotionsService.getAllPromotions( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promotions: IPromotions ) => this.promotions = promotions );
  }

  private initFormPromoCods() {
    this.formPromoCods = this.fb.group( {
      promotionName: '',
      code: '',
      accountCode: '',
      description: '',
      reason: '',
      dateFrom: '',
      dateTo: '',
      flightDateFrom: '',
      flightDateTo: '',
    } );
  }

  private resetForm() {
    _( this.formPromoCods.value ).each( ( value, key ) => {
      this.formPromoCods.get( key ).patchValue( '' );
      this.formPromoCods.get( key ).setErrors( null );
    } );
  }


  private initAutocomplete() {
    this.promotionsOptions = this.autocomplete( 'promotionName', 'promotion' );
    // this.locationToOptions = this.autocomplete( 'arrpoint', 'location' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formPromoCods.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promotion':
              return this.promotions.result.filter( promotions => promotions.promotionName.toLowerCase().includes( val.toLowerCase() ) );
              break;
          }
        } )
      );
  }

  add( event: MatChipInputEvent, formControlName: string, chips: string ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this[ chips ].push( value.trim() );
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }

    this.formPromoCods.get( formControlName ).setValue( null );
  }

  remove( textChip: string, arrayChips: string[], chips ): void {
    const index = arrayChips.indexOf( textChip );

    if ( index >= 0 ) {
      this[ chips ].splice( index, 1 );
    }
  }

  selected( event: MatAutocompleteSelectedEvent, formControlName: string, chips: string, fruitInput: string ): void {
    this[ chips ].push( event.option.viewValue );
    this[ fruitInput ].nativeElement.value = '';
    this.formPromoCods.get( formControlName ).setValue( null );
  }


  saveForm(): void {

    const params = {
      PromotionId: _.chain( this.promotions.result )
        .find( [ 'promotionName', this.formPromoCods.get( 'promotionName' ).value ] )
        .get( 'promotionId' )
        .value(),
      code: this.formPromoCods.get( 'code' ).value,
      accountCode: this.formPromoCods.get( 'accountCode' ).value,
      description: this.formPromoCods.get( 'description' ).value,
      reason: this.formPromoCods.get( 'reason' ).value,
      dateFrom: this.formPromoCods.get( 'dateFrom' ).value ?
        moment( this.formPromoCods.get( 'dateFrom' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      dateTo: this.formPromoCods.get( 'dateTo' ).value ?
        moment( this.formPromoCods.get( 'dateTo' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      flightDateFrom: this.formPromoCods.get( 'flightDateFrom' ).value ?
        moment( this.formPromoCods.get( 'flightDateFrom' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      flightDateTo: this.formPromoCods.get( 'flightDateTo' ).value ?
        moment( this.formPromoCods.get( 'flightDateTo' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
    };
    console.log( params );
  }

  clearForm(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
