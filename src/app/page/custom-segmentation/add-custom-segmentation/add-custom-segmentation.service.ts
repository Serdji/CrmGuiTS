import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';

@Injectable({
  providedIn: 'root'
})
export class AddCustomSegmentationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getCustomSegmentationTemplate(): Observable<ICustomSegmentationTemplate[]> {
    return this.http.get( `${this.configService.crmApi}/crm/segmentation`).pipe( this.retryRequestService.retry() ) as Observable<ICustomSegmentationTemplate[]>;
  }

  getCustomSegmentation( id: number ): Observable<ICustomSegmentationTemplate[]> {
    return this.http.get( `${this.configService.crmApi}}/crm/customSegmentation/templateParameters/${id}`).pipe( this.retryRequestService.retry() ) as Observable<ICustomSegmentationTemplate[]>;
  }

}
