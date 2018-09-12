import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListSegmentationService {

  public subjectSegmentations = new Subject();

  constructor( private http: HttpClient) { }

  getSegmentation( ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/segmentation`).pipe( retry( 10 ) );
  }

  deleteSegmentations( params ): Observable<any> {
    this.subjectSegmentations.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${environment.crmApi}/crm/segmentation/deleteSegmentations`, httpOptions ).pipe( retry( 10 ) );
  }

}
