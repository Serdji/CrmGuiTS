import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, Subject } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { ConfigService } from '../../services/config-service.service';
import { RetryRequestService } from '../../services/retry-request.service';
import { TodoItemNode } from './report-access-rights.component';
import * as R from 'ramda';


@Injectable( {
  providedIn: 'root'
} )
export class ReportAccessRightsService {

  public subjectIsReport = new Subject();

  private TREE_DATA: TodoItemNode[] = [];
  private propItem = R.prop( 'item' );
  private propName = R.prop( 'name' );
  private uniqByName = R.uniqBy( this.propItem );
  // @ts-ignore
  private composeUnnestConfig = R.compose( R.unnest, R.last );
  private reports;
  private mapNameReport = R.map( this.propName );


  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


  // Мапируем массив из строк во вложенную структуру
  private mapPathConversion = R.map( ( template: string ): TodoItemNode[] => {
    // Рекурсивная функция для структурирования вложенностей
    // @ts-ignore
    const funcRecurConfig = ( splitDrop, configTreeData = [], children = [], i = 1 ) => {
      if ( !R.isNil( splitDrop[ 0 ] ) ) {
        const downChildrenReportId = R.find( R.propEq( 'name', splitDrop[ 0 ] ), this.reports );
        children.push( {
          level: i,
          item: splitDrop[ 0 ],
          children: [],
          // Забераем id из исходного экземпляра объекта
          reportId: !R.isNil( downChildrenReportId ) ? downChildrenReportId.reportId : ''
        } );
        configTreeData.push( children );
      }
      if ( !R.isEmpty( splitDrop ) ) funcRecurConfig( R.tail( splitDrop ), configTreeData, children[ 0 ].children, ++i );
      return configTreeData;
    };
    const composeTreeDataSplitDrop = R.compose(
      R.filter( R.propEq( 'level', 1 ) ),
      R.unnest,
      funcRecurConfig,
      R.append( template ),
      R.dropLast( 1 ),
      // @ts-ignore
      R.split( '/' )
    );
    // @ts-ignore
    this.TREE_DATA.push( R.unnest( composeTreeDataSplitDrop( template ) ) );
    return this.TREE_DATA;
  } );

  private startMap = report => {
    this.reports = report;
    return report;
  };

  // Маппинг для уделения повторений и проверки вложанностей структуры каталогов
  private mapRemoveRepetitions = ( templates: any ): TodoItemNode[] => {
    const unnestConfig = this.composeUnnestConfig( templates );
    const uniqByConfig = this.uniqByName( unnestConfig );

    // Рекурсия для прохода по не определленной глубене вложанности дерева
    const funcRecurRecDist = ( uniqByCon, unnestCon ) => {
      const mapUniqByConfig = R.map( ( receiver: any ) => {
        const mapUnnestConfig = R.map( ( distributor: any ) => {
          if ( !R.isNil( receiver.children[ 0 ] ) ) {
            if ( receiver.item === distributor.item ) receiver.children.push( distributor.children[ 0 ] );
            if ( !R.isEmpty( receiver.children ) ) funcRecurRecDist( receiver.children, receiver.children );
          }
        } );
        mapUnnestConfig( unnestCon );
        if ( !R.isEmpty( receiver.children ) ) {
          receiver.children = this.uniqByName( receiver.children );
          return receiver;
        }
      } );
      return mapUniqByConfig( uniqByCon );
    };
    return funcRecurRecDist( uniqByConfig, unnestConfig );
  };

  private isReportFn = report => !R.isEmpty( report );
  private tapFn = report =>  this.subjectIsReport.next( this.isReportFn( report ) );

  setMaps() {
    return pipe(
      this.retryRequestService.retry(),
      tap( this.tapFn ),
      takeWhile( this.isReportFn ),
      map( this.startMap ),
      map( this.mapNameReport ),
      // @ts-ignore
      map( this.mapPathConversion ),
      map( this.mapRemoveRepetitions )
    );
  }

  getMyReport(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/report' ).pipe( this.setMaps() );
  }

  getAdminReport(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/admin/report' ).pipe( this.setMaps() );
  }

  getCustomerReport( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/admin/customerReport/${id}` ).pipe( this.retryRequestService.retry() );
  }
}
