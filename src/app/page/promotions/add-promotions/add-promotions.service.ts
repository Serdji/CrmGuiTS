import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IPromotions } from '../../../interface/ipromotions';

@Injectable( {
  providedIn: 'root'
} )
export class AddPromotionsService {

  public subjectDeletePromotions = new Subject();


  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  savePromotions( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promotions', params ).pipe( this.retryRequestService.retry() );
  }

  getAllPromotions( params ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promotions', { params } ).pipe( this.retryRequestService.retry() );
  }

  deletePromotions( params ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/promotions/deletePromotions`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  updatePromotions( params ): Observable<any> {
    return this.http.put( this.configService.crmApi + '/crm/promotions', params ).pipe( this.retryRequestService.retry() );
  }

  promotionValidator( formControlValue: string ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promotions?from=0&count=10000' )
      .pipe(
        this.retryRequestService.retry(),
        delay(1000),
        map( ( promotions: IPromotions ) => promotions.result ),
        map( ( promotionResult: any ) => promotionResult.filter( promotion => promotion.promotionName.toLowerCase().includes( formControlValue.toLowerCase() ) ) ),
        map( ( promotionsArr: any ) => promotionsArr && promotionsArr.length > 0 )
      );
  }

}












