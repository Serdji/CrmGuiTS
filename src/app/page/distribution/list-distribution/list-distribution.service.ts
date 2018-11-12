import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';

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
    return this.http.get( `${this.configService.crmApi}/crm/distribution` ).pipe( retry( 10 ) );
  }

  deleteDistributions( params ): Observable<any> {
    this.subjectDistributionDelete.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/deleteDistributions`, httpOptions ).pipe( retry( 10 ) );
  }

}
