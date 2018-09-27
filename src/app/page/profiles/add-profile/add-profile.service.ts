import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../services/config-service.service';

@Injectable({
  providedIn: 'root'
})
export class AddProfileService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  addProfile( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/customer', params ).pipe( retry( 1 ) );
  }
}
