import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddSegmentationService {

  constructor(  private http: HttpClient ) { }

  getProfiles( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/segmentation/${id}/result`).pipe( retry( 10 ) );
  }

}
