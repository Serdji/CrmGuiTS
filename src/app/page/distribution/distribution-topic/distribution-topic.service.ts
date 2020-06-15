import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { IDistributionTopic } from '../../../interface/idistribution-topic';

@Injectable({
  providedIn: 'root'
})
export class DistributionTopicService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  public getAllDistributionSubjects() {
    return this.http.get<IDistributionTopic[]>(`${this.configService.crmApi}/crm/distsubject` ).pipe( this.retryRequestService.retry() );
  }

  public addAllDistributionSubjects( params: IDistributionTopic ) {
    return this.http.post<IDistributionTopic[]>(`${this.configService.crmApi}/crm/distsubject`,  params ).pipe( this.retryRequestService.retry() );
  }

}
