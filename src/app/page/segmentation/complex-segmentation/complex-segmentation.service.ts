import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { IComplexSegmentation } from '../../../interface/icomplex-segmentation';

@Injectable({
  providedIn: 'root'
})
export class ComplexSegmentationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  setComplexSegmentation( params: { segmentationTitle: string, segmentationsIds: number[] } ) {
    return this.http.post<IComplexSegmentation>( `${this.configService.crmApi}/crm/complexSegmentation`, params ).pipe( this.retryRequestService.retry() );
  }
  putComplexSegmentation( params: { segmentationId: number, segmentationTitle: string, segmentationsIds: number[] } ) {
    return this.http.put<IComplexSegmentation>( `${this.configService.crmApi}/crm/complexSegmentation`, params ).pipe( this.retryRequestService.retry() );
  }

}
