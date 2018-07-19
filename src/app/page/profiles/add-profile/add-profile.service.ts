import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AddProfileService {

  constructor( private http: HttpClient ) { }

  addProfile( params ): Observable<any> {
    return this.http.post( environment.crmApi + '/crm/customer', params ).pipe( retry( 10 ) );
  }
}
