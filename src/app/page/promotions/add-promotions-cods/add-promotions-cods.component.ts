import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, pipe, timer } from 'rxjs';
import { delay, map, takeWhile } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog } from '@angular/material';
import { Ilocation } from '../../../interface/ilocation';
import { AddPromotionsService } from '../add-promotions/add-promotions.service';
import { IPromotions } from '../../../interface/ipromotions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { AddPromotionsCodsService } from './add-promotions-cods.service';
import { IPromoCodeValTypes } from '../../../interface/ipromo-code-val-types';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IPromoCod } from '../../../interface/ipromo-cod';
import { IProfilePromoCode } from '../../../interface/iprofile-promo-code';
import { TableAsyncService } from '../../../services/table-async.service';
import { IpagPage } from '../../../interface/ipag-page';

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
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];
  public promotionsOptions: Observable<IPromotions[]>;
  public locationFromOptions: Observable<Ilocation[]>;
  public locationToOptions: Observable<Ilocation[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<IcustomerGroup[]>;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public promoCodeRouteList: any[] = [];
  public promoCodeValTypes: IPromoCodeValTypes;
  public profilePromoCode: IProfilePromoCode;

  public promoCodeFlightListSelectable = true;
  public promoCodeFlightListRemovable = true;
  public addPromoCodeFlightListOnBlur = false;
  public promoCodeFlightListChips: string[] = [];

  public promoCodeBrandListSelectable = true;
  public promoCodeBrandListRemovable = true;
  public addPromoCodeBrandListOnBlur = false;
  public promoCodeBrandListChips: string[] = [];

  public promoCodeRbdListSelectable = true;
  public promoCodeRbdListRemovable = true;
  public addPromoCodeRbdListOnBlur = false;
  public promoCodeRbdListChips: string[] = [];

  public promoCodeCustomerListSelectable = true;
  public promoCodeCustomerListRemovable = true;
  public addPromoCodeCustomerListOnBlur = false;
  public promoCodeCustomerListChips: string[] = [];

  public segmentationSelectable = true;
  public segmentationRemovable = true;
  public addSegmentationOnBlur = false;
  public segmentationChips: string[] = [];

  public customerGroupSelectable = true;
  public customerGroupRemovable = true;
  public addCustomerGroupOnBlur = false;
  public customerGroupChips: string[] = [];

  public buttonSave: boolean;
  public buttonCreate: boolean;
  public buttonDelete: boolean;
  public buttonSearch: boolean;
  public isTable: boolean;

  private isActive: boolean;
  private autDelay: number;
  private promoCodeId: number;

  @ViewChild( 'promoCodeFlightListChipInput' ) promoCodeFlightListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeBrandListChipInput' ) promoCodeBrandListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeRbdListChipInput' ) promoCodeRbdListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'promoCodeCustomerListChipInput' ) promoCodeCustomerListInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'segmentationChipInput' ) segmentationFruitInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'customerGroupChipInput' ) customerGroupFruitInput: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private addPromotionsService: AddPromotionsService,
    private addPromotionsCodsService: AddPromotionsCodsService,
    private profileSearchService: ProfileSearchService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonDelete = true;
    this.buttonSearch = true;
    this.isActive = true;
    this.isLoader = true;
    this.autDelay = 500;
    this.initFormPromoCods();
    this.initAutocomplete();
    this.initPromotions();
    this.initLocation();
    this.initSegmentation();
    this.initCustomerGroup();
    this.initPromoCodeValTypes();
    this.initQueryParams();
    this.initTableProfilePagination();
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.buttonSave = true;
          this.buttonCreate = false;
          this.buttonDelete = false;
          this.buttonSearch = false;
          this.promoCodeId = +params.id;
          this.formFilling( this.promoCodeId );
        }
      } );
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

  private initLocation() {
    this.profileSearchService.getLocation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( locations: Ilocation[] ) => {
        this.locations = locations;
      } );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( segmentation: ISegmentation[] ) => {
        this.segmentation = segmentation;
      } );
  }

  private initCustomerGroup() {
    this.profileGroupService.getProfileGroup()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( customerGroup: IcustomerGroup[] ) => {
        this.customerGroup = customerGroup;
      } );
  }

  private initPromoCodeValTypes() {
    this.addPromotionsCodsService.getPromoCodeValTypes()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCodeValTypes: IPromoCodeValTypes ) => this.promoCodeValTypes = promoCodeValTypes );
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          promoCodeId: this.promoCodeId,
          from: pageIndex,
          count: value.pageSize,
          sortvalue: 'last_name'
        };
        this.addPromotionsCodsService.getProfiles( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( profilePromoCode: IProfilePromoCode ) => this.tableAsyncService.setTableDataSource( profilePromoCode.result ) );
      } );
  }

  private initTableProfile( id: number ) {
    const params = {
      promoCodeId: id,
      from: 0,
      count: 10,
      sortvalue: 'last_name'
    };
    this.addPromotionsCodsService.getProfiles( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( profilePromoCode: IProfilePromoCode ) => {
        this.tableAsyncService.countPage = profilePromoCode.totalCount;
        this.profilePromoCode = profilePromoCode;
        this.isLoader = false;
      } );
  }

  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.promoCodeId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
          this.resetForm();
        } );
    }
  }

  private formFilling( id: number ) {
    this.addPromotionsCodsService.getPromoCode( +id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( promoCod: IPromoCod ) => {
        _.set( promoCod, 'promotionName', _.get( promoCod, 'promotion.promotionName' ) );
        _.each( promoCod, ( value: any, key: string ) => {
          if ( !_.isNull( value ) && !_.isNaN( value ) ) {
            if ( _.isArray( value ) ) {
              switch ( key ) {
                case 'promoCodeBrandList':
                  this.promoCodeBrandListChips = value;
                  break;
                case 'promoCodeFlightList':
                  this.promoCodeFlightListChips = value;
                  break;
                case 'promoCodeRbdList':
                  this.promoCodeRbdListChips = value;
                  break;
                case 'promoCodeRouteList':
                  this.promoCodeRouteList = value;
                  break;
                case 'customersIds':
                  this.promoCodeCustomerListChips = value;
                  break;
                case 'segmentations':
                  this.segmentationChips = _.map( value, 'title' );
                  break;
                case 'customerGroups':
                  this.customerGroupChips = _.map( value, 'customerGroupName' );
                  break;
              }
            } else {
              _.each( this.formPromoCods.getRawValue(), ( valForm, keyForm ) => {
                if ( keyForm === key ) this.formPromoCods.get( key ).patchValue( value );
              } );
            }
          }
        } );
      } );
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
      promoCodeBrandList: '',
      promoCodeFlightList: '',
      promoCodeRbdList: '',
      dep_Location: '',
      arr_Location: '',
      customersIds: '',
      segmentations: '',
      customerGroups: '',
      usesPerPerson: '',
      usesTotal: '',
      val: '',
      promoCodeValTypeId: '',
    } );
  }

  private resetForm() {
    this.promoCodeBrandListChips = [];
    this.promoCodeFlightListChips = [];
    this.promoCodeRbdListChips = [];
    this.promoCodeCustomerListChips = [];
    this.promoCodeRouteList = [];
    this.segmentationChips = [];
    this.customerGroupChips = [];
    _( this.formPromoCods.value ).each( ( value, key ) => {
      this.formPromoCods.get( key ).patchValue( '' );
      this.formPromoCods.get( key ).setErrors( null );
    } );
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonSearch = true;
    this.buttonDelete = true;
  }


  private initAutocomplete() {
    this.promotionsOptions = this.autocomplete( 'promotionName', 'promotion' );
    this.locationFromOptions = this.autocomplete( 'dep_Location', 'location' );
    this.locationToOptions = this.autocomplete( 'arr_Location', 'location' );
    this.segmentationOptions = this.autocomplete( 'segmentations', 'segmentations' );
    this.customerGroupOptions = this.autocomplete( 'customerGroups', 'customerGroups' );
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formPromoCods.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        delay( this.autDelay ),
        map( val => {
          switch ( options ) {
            case 'promotion':
              if ( val ) return this.promotions.result.filter( promotions => promotions.promotionName.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'location':
              if ( val ) return this.locations.filter( location => location.locationCode.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'segmentations':
              if ( val !== null ) return this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( val.toLowerCase() ) );
              break;
            case 'customerGroups':
              return this.customerGroup.filter( customerGroup => {
                  if ( val !== null ) return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                }
              );
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

  directionAdd(): void {
    if (
      this.formPromoCods.get( 'dep_Location' ).value !== '' &&
      this.formPromoCods.get( 'arr_Location' ).value !== ''
    ) {
      this.promoCodeRouteList.push(
        {
          dep_Location: this.formPromoCods.get( 'dep_Location' ).value,
          arr_Location: this.formPromoCods.get( 'arr_Location' ).value
        }
      );
    }
    this.formPromoCods.get( 'dep_Location' ).patchValue( '' );
    this.formPromoCods.get( 'arr_Location' ).patchValue( '' );
  }

  directionRemove( dep: string, arr: string ): void {
    const obj: any = { 'dep_Location': dep, 'arr_Location': arr };
    this.promoCodeRouteList = _.reject( this.promoCodeRouteList, obj );
  }

  private promoCodeParameters() {
    const segmentation = [];
    const customerGroup = [];

    _.each( this.segmentationChips, segmentationChip => {
      segmentation.push( _.chain( this.segmentation ).find( { 'title': segmentationChip } ).get( 'segmentationId' ).value() );
    } );

    _.each( this.customerGroupChips, customerGroupChip => {
      customerGroup.push( _.chain( this.customerGroup ).find( { 'customerGroupName': customerGroupChip } ).get( 'customerGroupId' ).value() );
    } );

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
      usesPerPerson: this.formPromoCods.get( 'usesPerPerson' ).value,
      usesTotal: this.formPromoCods.get( 'usesTotal' ).value,
      val: this.formPromoCods.get( 'val' ).value,
      promoCodeValTypeId: this.formPromoCods.get( 'promoCodeValTypeId' ).value,
      promoCodeBrandList: this.promoCodeBrandListChips,
      promoCodeFlightList: this.promoCodeFlightListChips,
      promoCodeRbdList: this.promoCodeRbdListChips,
      customersIds: this.promoCodeCustomerListChips,
      segmentationsIds: segmentation,
      customerGroupsIds: customerGroup,
      promoCodeRouteList: this.promoCodeRouteList,
    };
    return params;
  }

  saveForm(): void {
    this.addPromotionsCodsService.savePromoCode( this.promoCodeParameters() )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( value => {
        this.windowDialog( `Промокод успешно сохранен`, 'ok' );
        this.router.navigate( [ '/crm/add-promotions-cods' ], { queryParams: { id: value.promoCodeId } } );
      } );
  }

  searchForm(): void {
    this.isTable = true;
    this.isLoader = true;
    this.initTableProfile( this.promoCodeId );
  }

  createForm(): void {
    this.addPromotionsCodsService.updatePromoCode( this.promoCodeParameters() )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.windowDialog( `Промокод успешно изменен`, 'ok' );
      } );
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/add-promotions-cods' ], { queryParams: {} } );
  }

  deletePromoCode(): void {
    this.windowDialog( `Вы действительно хотите удалить промокод  "${ this.promoCodeParameters().code }" ?`, 'delete', 'promoCode', true );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
