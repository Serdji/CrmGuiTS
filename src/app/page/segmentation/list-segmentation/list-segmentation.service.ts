import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../../services/config-service.service';

@Injectable({
  providedIn: 'root'
})
export class ListSegmentationService {

  public subjectSegmentations = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getSegmentation( ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/segmentation`).pipe( retry( 5 ) );
  }

  deleteSegmentations( params ): Observable<any> {
    this.subjectSegmentations.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/segmentation/deleteSegmentations`, httpOptions ).pipe( retry( 5 ) );
  }

}
