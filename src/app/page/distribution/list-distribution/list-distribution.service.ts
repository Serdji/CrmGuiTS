import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class ListDistributionService {

  public subjectDistribution = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getDistribution(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution` ).pipe( retry( 10 ) );
  }

}
