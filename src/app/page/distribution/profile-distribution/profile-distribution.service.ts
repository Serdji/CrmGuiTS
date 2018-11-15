import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { IdistributionProfile } from '../../../interface/idistribution-profile';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileDistributionService {

  public profileDistributionSubject = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfileDistribution( params: any ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution/search`, { params } ).pipe(
      retry( 10 ),
      map( ( distributionProfile: IdistributionProfile ) => {
        if ( _.has( distributionProfile, 'lastTryDT' ) ) {
          return _.set( distributionProfile, 'lastTryDT', moment( moment.utc( distributionProfile.lastTryDT ).toDate() ).format( 'DD.MM.YYYY HH:mm' ) );
        }
      } )
    );
  }

  startDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Start`, { id } ).pipe( retry( 10 ) );
  }

  stopDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Cancel`, { id } ).pipe( retry( 10 ) );
  }


}
