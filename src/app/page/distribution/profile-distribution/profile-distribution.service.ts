import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileDistributionService {

  public profileDistributionSubject = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfileDistribution( params: any ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution/search`, { params } ).pipe( retry( 10 ) );
  }

  startDistribution( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/${id}/Start` ).pipe( retry( 10 ) );
  }

  stopDistribution( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/${id}/Cancel` ).pipe( retry( 10 ) );
  }


}
