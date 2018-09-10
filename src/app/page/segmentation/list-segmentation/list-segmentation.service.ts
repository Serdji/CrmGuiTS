import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListSegmentationService {

  constructor( private http: HttpClient) { }

  getSegmentation( ): Observable<any> {
    return this.http.get( `${environment.crmApi}}/crm/segmentation`).pipe( retry( 10 ) );
  }

}
