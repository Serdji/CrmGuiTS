import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { IAgeGroup } from '../../../interface/iage-group';

@Injectable({
  providedIn: 'root'
})
export class AgeIntervalService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  public getAgeGroups() {
    return this.http.get<IAgeGroup>( this.configService.crmApi + `/crm/configuration/agegroups` ).pipe( this.retryRequestService.retry() );
  }


}
