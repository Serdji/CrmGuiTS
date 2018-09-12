import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class AddSegmentationService {

  constructor( private http: HttpClient ) { }

  getProfiles( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/segmentation/${id}/result` ).pipe( retry( 10 ) );
  }

  getSegmentationParams( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/segmentation/${id}/parameters` ).pipe( retry( 10 ) );
  }

  saveSegmentation( params ): Observable<any> {
    return this.http.post( environment.crmApi + '/crm/segmentation', params ).pipe( retry( 10 ) );
  }

  deleteSegmentation( id: number ): Observable<any> {
    return this.http.delete( `${environment.crmApi}/crm/segmentation/${id}` ).pipe( retry( 10 ) );
  }


}
