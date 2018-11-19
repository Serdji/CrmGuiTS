import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class AddSegmentationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfiles( params ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/segmentation/result`, { params } ).pipe( this.retryRequestService.retry() );
  }

  getSegmentationParams( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/segmentation/${id}/parameters` ).pipe( this.retryRequestService.retry() );
  }

  saveSegmentation( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/segmentation', params ).pipe( this.retryRequestService.retry() );
  }

  updateSegmentation( params ): Observable<any> {
    return this.http.put( this.configService.crmApi + '/crm/segmentation', params ).pipe( this.retryRequestService.retry() );
  }

  deleteSegmentation( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/segmentation/${id}` ).pipe( this.retryRequestService.retry() );
  }


}
