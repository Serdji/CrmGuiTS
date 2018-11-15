import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Idistribution } from '../../../interface/idistribution';

@Injectable( {
  providedIn: 'root'
} )
export class ListDistributionService {

  public subjectDistributionDelete = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getDistribution(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution` ).pipe(
      retry( 10 ),
      map( ( distributions: Idistribution[] ) => {
        _.each( distributions, distribution => {
          if ( _.has( distribution, 'lastTryDT' ) ) {
            _.set( distribution, 'lastTryDT', moment( moment.utc( distribution.lastTryDT ).toDate() ).format( 'DD.MM.YYYY HH:mm' ) );
          }
        } );
        return distributions;
      } )
    );
  }

  deleteDistributions( params ): Observable<any> {
    this.subjectDistributionDelete.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/deleteDistributions`, httpOptions ).pipe( retry( 10 ) );
  }

  deleteDistribution( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/${id}` ).pipe(retry( 10 ));
  }

}
