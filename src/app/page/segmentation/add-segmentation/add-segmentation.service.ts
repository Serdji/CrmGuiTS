import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
    return this.http.get( `${environment.crmApi}/crm/segmentation/result`, { params } ).pipe( retry( 10 ) );
  }

  getSegmentationParams( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/segmentation/${id}/parameters` ).pipe( retry( 10 ) );
  }

  saveSegmentation( params ): Observable<any> {
    return this.http.post( environment.crmApi + '/crm/segmentation', params ).pipe( retry( 10 ) );
  }

  updateSegmentation( params ): Observable<any> {
    return this.http.put( environment.crmApi + '/crm/segmentation', params ).pipe( retry( 10 ) );
  }

  deleteSegmentation( id: number ): Observable<any> {
    return this.http.delete( `${environment.crmApi}/crm/segmentation/${id}` ).pipe( retry( 10 ) );
  }


}
