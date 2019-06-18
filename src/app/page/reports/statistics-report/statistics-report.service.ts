import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsReportService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getMyReport( ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/report' ).pipe( this.retryRequestService.retry() );
  }

  getAdminReport( ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/admin/report' ).pipe( this.retryRequestService.retry() );
  }

  setAdminReports( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/admin/report', params ).pipe( this.retryRequestService.retry() );
  }

  getParamsDynamicForm( params: string ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/reports/getParams?reportName=${ params }` ).pipe( this.retryRequestService.retry() );
  }

  getParams( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/reports/getReport', params, { responseType: 'blob', observe: 'response' } ).pipe( this.retryRequestService.retry() );
  }



}
