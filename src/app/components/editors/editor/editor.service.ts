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

  setDistribution( params: IprofileSearch ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/distribution/searchAndCreateDistribution', params ).pipe( retry( 10 ) );
  }

  getDistributionPlaceholders(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/dictionary/distributionPlaceholders' ).pipe( retry( 10 ) );
  }

  getTemplates(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/distribution/templates' ).pipe( retry( 10 ) );
  }

  getTemplate( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/templates/${id}` ).pipe( retry( 10 ) );
  }

}
