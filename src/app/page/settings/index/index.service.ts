import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { IindexConfig } from '../../../interface/iindex-config';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  public getIndexConfig() {
    return this.http.get<IindexConfig>( this.configService.crmApi + `/crm/configuration` ).pipe( this.retryRequestService.retry() );
  }

  public putIndexConfig( params: IindexConfig ) {
    return this.http.put<IindexConfig>( this.configService.crmApi + `/crm/configuration`, params ).pipe( this.retryRequestService.retry() );
  }
}
