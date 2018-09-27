import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable()
export class ProfileSearchService {

  private params: any;
  public subjectDeleteProfile = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getCountry(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/country' ).pipe( retry( 1 ) );
  }
  getLocation(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/location' ).pipe( retry( 1 ) );
  }

  getProfileSearch( params: IprofileSearch ): Observable<any> {
    this.params = params;
    return this.http.get( this.configService.crmApi + '/crm/customer/search', { params: this.params } ).pipe( retry( 1 ) );
  }

  deleteProfiles( params ): Observable<any> {
    this.subjectDeleteProfile.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( this.configService.crmApi + '/crm/customer/deleteCustomers', httpOptions ).pipe( retry( 1 ) );
  }
}










