import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { CheckTokenService } from '../../../services/check-token.service';

@Injectable( {
  providedIn: 'root'
} )
export class ListSegmentationService {

  public subjectSegmentations = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService,
    private CT: CheckTokenService
  ) { }

  getSegmentation(): Observable<any> {
    if ( !this.CT.isClaims( 'analytics:read' ) ) return of( [] );
    return this.http.get( `${this.configService.crmApi}/crm/segmentation` ).pipe( this.retryRequestService.retry() );
  }

  deleteSegmentations( params ): Observable<any> {
    this.subjectSegmentations.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/segmentation/deleteSegmentations`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

}
