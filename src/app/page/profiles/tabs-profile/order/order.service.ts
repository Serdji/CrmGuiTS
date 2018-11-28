import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


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

              const currency = _.chain( order.MonetaryInfo )
                .filter( 'ticket' )
                .find( 'Currency' )
                .get('Currency')
                .value();

    // ------------------------- Сумма по каждой из валют в ticket --------------------------
              const ticketAmoT = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'Amount' );
              const ticketEurT = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountEur' );
              const ticketUsdT = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountUsd' );
              const ticketCurT = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountCur' );

              const ticketEurE = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountEur' );
              const ticketUsdE = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountUsd' );
              const ticketCurE = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountCur' );

              const ticketEurB = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountEur' );
              const ticketUsdB = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountUsd' );
              const ticketCurB = _( order.MonetaryInfo )
                .filter( 'ticket' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountCur' );

              let subtractTicketEur, subtractTicketUsd, subtractTicketCur;
    // --------------------------------------------------------------------------------------


    // ------------------------- Сумма по каждой из валют в emd -----------------------------
              const emdEurT = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountEur' );
              const emdUsdT = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountUsd' );
              const emdCurT = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'T' ] )
                .sumBy( 'AmountCur' );

              const emdEurE = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountEur' );
              const emdUsdE = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountUsd' );
              const emdCurE = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'E' ] )
                .sumBy( 'AmountCur' );

              const emdEurB = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountEur' );
              const emdUsdB = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountUsd' );
              const emdCurB = _( order.MonetaryInfo )
                .filter( 'emd' )
                .filter( [ 'Code', 'B' ] )
                .sumBy( 'AmountCur' );

              let subtractEmdEur, subtractEmdUsd, subtractEmdCur;
     // --------------------------------------------------------------------------------------

              let sumEur, sumUsd, SumCur;
              let sumEurT, sumUsdT, SumCurT;

              // -------- Если в ticket есть хоть один элемент Code: E то вычитаем ticketT из ticketE, иначе из ticketB --------
              if ( _( order.MonetaryInfo ).filter( 'ticket' ).filter( [ 'Code', 'E' ] ).size() !== 0 ) {
                subtractTicketEur = ticketEurT - ticketEurE;
                subtractTicketUsd = ticketUsdT - ticketUsdE;
                subtractTicketCur = ticketCurT - ticketCurE;
              } else {
                subtractTicketEur = ticketEurT - ticketEurB;
                subtractTicketUsd = ticketUsdT - ticketUsdB;
                subtractTicketCur = ticketCurT - ticketCurB;
              }
              // ---------------------------------------------------------------------------------------------------------------


              // -------------- Если в emd есть хоть один элемент Code: E то вычитаем emdT из emdE, иначе из emdB --------------
              if ( _( order.MonetaryInfo ).filter( 'emd' ).filter( [ 'Code', 'E' ] ).size() !== 0 ) {
                subtractEmdEur = emdEurT - emdEurE;
                subtractEmdUsd = emdUsdT - emdUsdE;
                subtractEmdCur = emdCurT - emdCurE;
              } else {
                subtractEmdEur = emdEurT - emdEurB;
                subtractEmdUsd = emdUsdT - emdUsdB;
                subtractEmdCur = emdCurT - emdCurB;
              }
              // ---------------------------------------------------------------------------------------------------------------

              // ---- Сложение валют по ticket и emd с учетом таксы ----
              sumEur = subtractTicketEur + subtractEmdEur;
              sumUsd = subtractTicketUsd + subtractEmdUsd;
              SumCur = subtractTicketCur + subtractEmdCur;
              // -------------------------------------------------------

              // --- Сложение валют по ticket и emd без учетом таксы ---
              sumEurT = ticketEurT + emdEurT;
              sumUsdT = ticketUsdT + emdUsdT;
              SumCurT = ticketCurT + emdCurT;
              // -------------------------------------------------------

              // --- Пересчитанные валюты добавляем в коннец массива ---
              order.MonetaryInfo.push(
                { Code: 'TG', AmountEur: sumEurT, AmountUsd: sumUsdT, AmountCur: SumCurT }, // Всего по заказу
                { Code: 'TS', AmountEur: sumEur, AmountUsd: sumUsd, AmountCur: SumCur }, // Таксы и сборы
                { Code: 'TT', Amount: ticketAmoT, AmountEur: ticketEurT, AmountUsd: ticketUsdT, AmountCur: ticketCurT, Currency: currency } // Общие суммы вылют только по ticket
              );
              // -------------------------------------------------------
            }
          } );
// -------------------------------------------------------------------------------------------------------------

          const ticketCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );
          const ticketEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountEur' );
          const ticketUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountUsd' );


          const emdCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );
          const emdEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountEur' );
          const emdUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountUsd' );

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
