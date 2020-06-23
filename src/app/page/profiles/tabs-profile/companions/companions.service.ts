import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';
import { ICompanion } from '../../../../interface/icompanions';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanionsService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  public getCompanions( id: number ) {
    return this.http.get<ICompanion>( `${this.configService.crmApi}/crm/customer/${id}/companions` ).pipe( this.retryRequestService.retry(), shareReplay() );
  }

}
