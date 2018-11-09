import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getMessages( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distributions/customerEmails/${id}` ).pipe( retry( 10 ) );
  }

}
