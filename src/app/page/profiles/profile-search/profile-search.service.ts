import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { map } from 'rxjs/operators';
import { IAirlineLCode } from '../../../interface/iairline-lcode';
import { ICountries } from '../../../interface/icountries';
import * as _ from 'lodash';
import { concatAllStreamToArray } from '../../../utils/concatAllStreamToArray';
import { IAirport } from '../../../interface/iairport';
import { ISellType } from '../../../interface/isell-type';
import { ICity } from '../../../interface/icity';

@Injectable()
export class ProfileSearchService {

  private params: any;
  public subjectDeleteProfile = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  private mapConcatTitle( obj ) {
    return _.set(
      obj,
      'title',
      obj.lCode === obj.rCode ? obj.lCode : `${obj.lCode} ( ${obj.rCode} )`
    );
  }

  getAirports( text: string = '' ) {
    return this.http.get<IAirport[]>( this.configService.crmApi + `/crm/airport/${ text }` ).pipe( this.retryRequestService.retry() );
  }

  getCountries( text: string = '' ) {
    return this.http.get<ICountries[]>( this.configService.crmApi + `/crm/country/${ text }` ).pipe( this.retryRequestService.retry(), concatAllStreamToArray( map( this.mapConcatTitle ) ) );
  }

  getAirlineCodes( text: string = '' ) {
    return this.http.get<IAirlineLCode[]>( this.configService.crmApi + `/crm/airline/${ text }` ).pipe( this.retryRequestService.retry(), concatAllStreamToArray(map( this.mapConcatTitle )) );
  }

  getCities( text: string = '' ) {
    return this.http.get<ICity[]>( this.configService.crmApi + `/crm/city/${ text }` ).pipe( this.retryRequestService.retry() );
  }

  getSellType(  text: string = '' ): Observable<any> {
    return this.http.get<ISellType[]>( this.configService.crmApi + `/crm/selltype/${ text }` ).pipe( this.retryRequestService.retry() );
  }

  getProfileSearch( params ): Observable<any> {
    this.params = params;
    return this.http.get( this.configService.crmApi + '/crm/customer/search', { params: this.params } ).pipe( this.retryRequestService.retry() );
  }

  deleteProfiles( params ): Observable<any> {
    this.subjectDeleteProfile.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( this.configService.crmApi + '/crm/customer/deleteCustomers', httpOptions ).pipe( this.retryRequestService.retry() );
  }

  downloadCsv( params ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/customer/searchCsv', {
      params,
      responseType: 'blob',
      observe: 'response'
    } ).pipe( this.retryRequestService.retry() );
  }

}










