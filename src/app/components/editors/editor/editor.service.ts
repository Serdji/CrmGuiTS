import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class EditorService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  saveDistribution( params: IprofileSearch ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/distribution/searchAndCreateDistribution', params ).pipe( retry( 10 ) );
  }

  sendDistribution( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/${id}/Start` ).pipe( retry( 10 ) );
  }

  stopDistribution( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/${id}/Cancel` ).pipe( retry( 10 ) );
  }

  getDistributionPlaceholders(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/dictionary/distributionPlaceholders' ).pipe( retry( 10 ) );
  }

  getTemplates(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/distribution/templates' ).pipe( retry( 10 ) );
  }

  getEmailLimits(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/distributions/emailLimits' ).pipe( retry( 10 ) );
  }

  getTemplate( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/templates/${id}` ).pipe( retry( 10 ) );
  }

}











