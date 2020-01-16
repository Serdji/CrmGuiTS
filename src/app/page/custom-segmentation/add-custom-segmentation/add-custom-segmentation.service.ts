import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';
import { ICustomSegmentationTemplate } from '../../../interface/icustom-segmentation-template';
import { IParamsDynamicForm } from '../../../interface/iparams-dynamic-form';
import { ICustomSegmentationParams } from '../../../interface/icustom-segmentation-params';
import { ICustomSegmentationGetParams } from '../../../interface/icustom-segmentation-get-params';

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
    return this.http.get( `${this.configService.crmApi}/crm/customSegmentation/templates`).pipe( this.retryRequestService.retry() ) as Observable<ICustomSegmentationTemplate[]>;
  }

  getCustomSegmentation( id: number ): Observable<IParamsDynamicForm[]> {
    return this.http.get( `${this.configService.crmApi}/crm/customSegmentation/templateParameters/${id}`).pipe( this.retryRequestService.retry() ) as Observable<IParamsDynamicForm[]>;
  }

  getCustomSegmentationParams( id: number ): Observable<ICustomSegmentationGetParams> {
    return this.http.get( `${this.configService.crmApi}/crm/customSegmentation/parameters/${id}`).pipe( this.retryRequestService.retry() ) as Observable<ICustomSegmentationGetParams>;
  }

  setCustomSegmentation( params: ICustomSegmentationParams ): Observable<{ 'customSegmentationId': number }> {
    return this.http.post( `${this.configService.crmApi}/crm/customSegmentation`, params ).pipe( this.retryRequestService.retry() ) as Observable<{ 'customSegmentationId': number }>;
  }

  putCustomSegmentation( params: ICustomSegmentationParams ): Observable<{ 'customSegmentationId': number }> {
    return this.http.put( `${this.configService.crmApi}/crm/customSegmentation`, params ).pipe( this.retryRequestService.retry() ) as Observable<{ 'customSegmentationId': number }>;
  }

}
