import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { map } from 'rxjs/operators';
import * as R from 'ramda';
import { IAirlineLCode } from '../../../interface/iairline-lcode';
import { ICountries } from '../../../interface/icountries';

@Injectable()
export class ProfileSearchService {

  private params: any;
  public subjectDeleteProfile = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getAirports(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/airport' ).pipe( this.retryRequestService.retry() );
  }

  getCountries(): Observable<ICountries[]> {
    return this.http.get<ICountries[]>( this.configService.crmApi + '/crm/country' )
      .pipe(
        this.retryRequestService.retry(),
        map( ( countries: ICountries ) => {
          const countryTitleFn = country => {
            const titleLens = R.lensProp( 'title' );
            const titleFn = () => country.lCode === country.rCode ? country.lCode : `${country.lCode} ( ${country.rCode} )`;
            return R.set( titleLens, titleFn(), country );
          };
          return R.map( countryTitleFn, countries );
        } )
      );
  }

  getAirlineCodes(): Observable<IAirlineLCode[]> {
    return this.http.get<IAirlineLCode[]>( this.configService.crmApi + '/crm/airline' )
      .pipe(
        this.retryRequestService.retry(),
        map( ( airlineCodes: IAirlineLCode ) => {
          const airlineCodeTitleFn = airlineCode => {
            const titleLens = R.lensProp( 'title' );
            const titleFn = () => airlineCode.lCode === airlineCode.rCode ? airlineCode.lCode : `${airlineCode.lCode} ( ${airlineCode.rCode} )`;
            return R.set( titleLens, titleFn(), airlineCode );
          };
          return R.map( airlineCodeTitleFn, airlineCodes );
        } )
      );
  }

  getCities(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/city' ).pipe( this.retryRequestService.retry() );
  }

  getSellType(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/selltype' ).pipe( this.retryRequestService.retry() );
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










