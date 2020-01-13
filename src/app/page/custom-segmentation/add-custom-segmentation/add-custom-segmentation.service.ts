import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable({
  providedIn: 'root'
})
export class AddCustomSegmentationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }
}
