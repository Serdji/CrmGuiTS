import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';
import { IMonetaryInfo } from '../../../../interface/imonetary-info';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


//------------------------------- Суммирования валюты -------------------------------
  private sumTEB( moneyInfo: IMonetaryInfo, ticketOrEmd: string, code: string, amount: string ): number {
    return _( moneyInfo )
      .filter( ticketOrEmd )
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  }
//-------------------------------------------------------------------------------------------


//---------- Возвращает T E или B в зависимости от условия для суммирования валюты ----------
  private isTEB( moneyInfo: IMonetaryInfo, ticketOrEmd: string ): string {
    const isT = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'T' ] ).filter( 'Amount' ).size() !== 0;
    const isE = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'E' ] ).filter( 'Amount' ).size() !== 0;
    const isB = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'B' ] ).filter( 'Amount' ).size() !== 0;

    if ( isT ) return 'T';
    if ( !isT || isB ) return 'E';
    if ( !isT && !isB ) return 'E';
    if ( !isT && !isE ) return 'B';
  }
//-------------------------------------------------------------------------------------------

  getBooking( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        this.retryRequestService.retry(),
        map( ( orders: any ) => {
          orders = _( orders ).sortBy( 'lut' ).reverse().value();
          let counterServicesIsEmd = 0;

          _.each( orders, order => {
            if ( order.distrRecloc ) _.merge( _.find( order.pos ), { distrRecloc: _.find( order.distrRecloc ) } );
            if ( order.ssrs ) {
              if ( order.services ) {
                _.each( order.ssrs, ssr => {
                  if ( ssr.segNum || ssr.passNum ) {
                    order.services.push( ssr );
                  }
                } );
              } else {
                _.set( order, 'services', _.filter( order.ssrs, ssr => ssr.segNum || ssr.passNum ) );
              }
            }


            _.each( order.services, service => {
              if ( service.emd ) ++counterServicesIsEmd;
            } );

            _.each( order.segments, segment => {
              _.each( order.tickets, ticket => {
                if ( segment.segNum === ticket.segNum ) _.merge( ticket, { segment } );
              } );

              _.each( order.services, service => {
                if ( segment.segNum === service.segNum ) _.merge( service, { segment } );
              } );
            } );


// ------------------------------------------ Пересчет валют в заказе ------------------------------------------
            if ( order.MonetaryInfo ) {

              const money = order.MonetaryInfo;

              const currency = _.chain( money )
                .filter( 'ticket' )
                .filter( [ 'Code', this.isTEB( money, 'ticket' ) ] )
                .find( 'Currency' )
                .get( 'Currency' )
                .value();

              const ticketAmoTEB = _( money )
                .filter( 'ticket' )
                .filter( [ 'Code', this.isTEB( money, 'ticket' ) ] )
                .sumBy( 'Amount' );


    // ------------------------- Сумма по каждой из валют в ticket --------------------------

              const ticketEurTEB = this.sumTEB( money, 'ticket', this.isTEB( money, 'ticket' ), 'AmountEur' );
              const ticketUsdTEB = this.sumTEB( money, 'ticket', this.isTEB( money, 'ticket' ), 'AmountUsd' );
              const ticketCurTEB = this.sumTEB( money, 'ticket', this.isTEB( money, 'ticket' ), 'AmountCur' );

              const ticketEurE = this.sumTEB( money, 'ticket', 'E', 'AmountEur' );
              const ticketUsdE = this.sumTEB( money, 'ticket', 'E', 'AmountUsd' );
              const ticketCurE = this.sumTEB( money, 'ticket', 'E', 'AmountCur' );

              const ticketEurB = this.sumTEB( money, 'ticket', 'B', 'AmountEur' );
              const ticketUsdB = this.sumTEB( money, 'ticket', 'B', 'AmountUsd' );
              const ticketCurB = this.sumTEB( money, 'ticket', 'B', 'AmountCur' );

              let subtractTicketEur, subtractTicketUsd, subtractTicketCur;

    // --------------------------------------------------------------------------------------


    // ------------------------- Сумма по каждой из валют в emd -----------------------------

              const emdEurTEB = this.sumTEB( money, 'emd', this.isTEB( money, 'emd' ), 'AmountEur' );
              const emdUsdTEB = this.sumTEB( money, 'emd', this.isTEB( money, 'emd' ), 'AmountUsd' );
              const emdCurTEB = this.sumTEB( money, 'emd', this.isTEB( money, 'emd' ), 'AmountCur' );

              const emdEurE = this.sumTEB( money, 'emd', 'E', 'AmountEur' );
              const emdUsdE = this.sumTEB( money, 'emd', 'E', 'AmountUsd' );
              const emdCurE = this.sumTEB( money, 'emd', 'E', 'AmountCur' );

              const emdEurB = this.sumTEB( money, 'emd', 'B', 'AmountEur' );
              const emdUsdB = this.sumTEB( money, 'emd', 'B', 'AmountUsd' );
              const emdCurB = this.sumTEB( money, 'emd', 'B', 'AmountCur' );

              let subtractEmdEur, subtractEmdUsd, subtractEmdCur;

    // --------------------------------------------------------------------------------------

              let sumEur, sumUsd, SumCur;
              let sumEurT, sumUsdT, SumCurT;

              const isTicketE = _( money ).filter( 'ticket' ).filter( [ 'Code', 'E' ] ).size() !== 0;
              const isEmdE = _( money ).filter( 'emd' ).filter( [ 'Code', 'E' ] ).size() !== 0;

        // -------- Если в ticket есть хоть один элемент Code: E то вычитаем ticketT из ticketE, иначе из ticketB --------
              if ( isTicketE ) {
                subtractTicketEur = ticketEurTEB - ticketEurE;
                subtractTicketUsd = ticketUsdTEB - ticketUsdE;
                subtractTicketCur = ticketCurTEB - ticketCurE;
              } else {
                subtractTicketEur = ticketEurTEB - ticketEurB;
                subtractTicketUsd = ticketUsdTEB - ticketUsdB;
                subtractTicketCur = ticketCurTEB - ticketCurB;
              }
        // ---------------------------------------------------------------------------------------------------------------


        // -------------- Если в emd есть хоть один элемент Code: E то вычитаем emdT из emdE, иначе из emdB --------------
              if ( isEmdE ) {
                subtractEmdEur = emdEurTEB - emdEurE;
                subtractEmdUsd = emdUsdTEB - emdUsdE;
                subtractEmdCur = emdCurTEB - emdCurE;
              } else {
                subtractEmdEur = emdEurTEB - emdEurB;
                subtractEmdUsd = emdUsdTEB - emdUsdB;
                subtractEmdCur = emdCurTEB - emdCurB;
              }
        // ---------------------------------------------------------------------------------------------------------------

              // ---- Сложение валют по ticket и emd с учетом таксы ----
              sumEur = subtractTicketEur + subtractEmdEur;
              sumUsd = subtractTicketUsd + subtractEmdUsd;
              SumCur = subtractTicketCur + subtractEmdCur;
              // -------------------------------------------------------

              // --- Сложение валют по ticket и emd без учетом таксы ---
              sumEurT = ticketEurTEB + emdEurTEB;
              sumUsdT = ticketUsdTEB + emdUsdTEB;
              SumCurT = ticketCurTEB + emdCurTEB;
              // -------------------------------------------------------

              // --- Пересчитанные валюты добавляем в коннец массива ---
              order.MonetaryInfo.push(
                { Code: 'TG', AmountEur: sumEurT, AmountUsd: sumUsdT, AmountCur: SumCurT }, // Всего по заказу
                { Code: 'TS', AmountEur: sumEur, AmountUsd: sumUsd, AmountCur: SumCur }, // Таксы и сборы
                { Code: 'TT', Amount: ticketAmoTEB, AmountEur: ticketEurTEB, AmountUsd: ticketUsdTEB, AmountCur: ticketCurTEB, Currency: currency }, // Общие суммы вылют только по ticket
                { Code: 'TE', AmountEur: emdEurTEB, AmountUsd: emdUsdTEB, AmountCur: emdCurTEB, Currency: currency } // Общие суммы вылют только по emd
              );
              // -------------------------------------------------------
            }
          } );
// -------------------------------------------------------------------------------------------------------------


  //------------ Общая сумма по всем заказам из ticket с условием TEB ------------
          const ticketCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TG' ] )
            .sumBy( 'AmountCur' );
          const ticketEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TG' ] )
            .sumBy( 'AmountEur' );
          const ticketUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TG' ] )
            .sumBy( 'AmountUsd' );
  //------------------------------------------------------------------------------


  //-------------- Общая сумма по всем заказам из emd с условием TEB -------------
          const emdCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TE' ] )
            .sumBy( 'AmountCur' );
          const emdEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TE' ] )
            .sumBy( 'AmountEur' );
          const emdUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'TE' ] )
            .sumBy( 'AmountUsd' );
  //------------------------------------------------------------------------------

          const { lut } = _.maxBy( orders, o => o.lut );

          orders.push( {
            counterServicesIsEmd,
            lut,
            totalAmount: {
              ticket: {
                ticketCur,
                ticketEur,
                ticketUsd
              },
              emd: {
                emdCur,
                emdEur,
                emdUsd
              }
            }
          } );
          return orders;
        } )
      );
  }

}
