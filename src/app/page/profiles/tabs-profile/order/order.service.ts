import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';
import { IMonetaryInfo } from '../../../../interface/imonetary-info';
import * as R from 'ramda';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  public counterActiveServicesIsEmd = 0;
  public counterCancelledServicesIsEmd = 0;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


//---------------------------------- Суммирования валюты -----------------------------------
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


//------------- Суммирования по всем заказам с учетам только активных заказов ---------------
  private sumAllTEB( orders: any, code: string, amount: string ): number {
    return _( orders )
      .filter( [ 'BookingStatus', 'Active' ] )
      .map( 'MonetaryInfo' )
      .flattenDeep()
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  }

//-------------------------------------------------------------------------------------------

  private sortByLut = R.sortBy( R.prop( 'lut' ) );
  // @ts-ignore
  private orderSort = R.compose( R.reverse, this.sortByLut );
  private ordersMixing = R.map( ( orders: any ) => {
    if ( orders.distrRecloc ) _.merge( _.find( orders.pos ), { distrRecloc: _.find( orders.distrRecloc ) } );
    if ( orders.ssrs ) {
      if ( orders.services ) {
        _.map( orders.ssrs, ssr => {
          if ( ssr.segNum || ssr.passNum ) {
            orders.services.push( ssr );
          }
        } );
      } else {
        _.set( orders, 'services', _.filter( orders.ssrs, ssr => ssr.segNum || ssr.passNum ) );
      }
    }

    if ( orders.BookingStatus === 'Active' ) {
      _.map( orders.services, service => {
        if ( service.emd ) ++this.counterActiveServicesIsEmd;
      } );
    }

    if ( orders.BookingStatus === 'Cancelled' ) {
      _.map( orders.services, service => {
        if ( service.emd ) ++this.counterCancelledServicesIsEmd;
      } );
    }

    _.map( orders.segments, segment => {
      _.map( orders.tickets, ticket => {
        if ( segment.segNum === ticket.segNum ) _.merge( ticket, { segment } );
      } );

      _.map( orders.services, service => {
        if ( segment.segNum === service.segNum ) _.merge( service, { segment } );
      } );
    } );


// ------------------------------------------ Пересчет валют в заказе ------------------------------------------
    if ( orders.MonetaryInfo ) {

      const money = orders.MonetaryInfo;

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
      orders.MonetaryInfo.push(
        { Code: 'TG', AmountEur: sumEurT, AmountUsd: sumUsdT, AmountCur: SumCurT }, // Всего по заказу
        { Code: 'TS', AmountEur: sumEur, AmountUsd: sumUsd, AmountCur: SumCur }, // Таксы и сборы
        { Code: 'TT', Amount: ticketAmoTEB, AmountEur: ticketEurTEB, AmountUsd: ticketUsdTEB, AmountCur: ticketCurTEB, Currency: currency }, // Общие суммы вылют только по ticket
        { Code: 'TE', AmountEur: emdEurTEB, AmountUsd: emdUsdTEB, AmountCur: emdCurTEB, Currency: currency } // Общие суммы вылют только по emd
      );
      // -------------------------------------------------------
    }
    return orders;
  } );
  private ordersAmount = ( orders: any ) => {
    //------------ Общая сумма по всем заказам из ticket с условием TEB ------------
    const ticketCur = this.sumAllTEB( orders, 'TG', 'AmountCur' );
    const ticketEur = this.sumAllTEB( orders, 'TG', 'AmountEur' );
    const ticketUsd = this.sumAllTEB( orders, 'TG', 'AmountUsd' );
    //------------------------------------------------------------------------------


    //-------------- Общая сумма по всем заказам из emd с условием TEB -------------
    const emdCur = this.sumAllTEB( orders, 'TE', 'AmountCur' );
    const emdEur = this.sumAllTEB( orders, 'TE', 'AmountEur' );
    const emdUsd = this.sumAllTEB( orders, 'TE', 'AmountUsd' );
    //------------------------------------------------------------------------------


    const countActiveTicket = _( orders ).filter( [ 'BookingStatus', 'Active' ] ).size();
    const countCancelledTicket = _( orders ).filter( [ 'BookingStatus', 'Cancelled' ] ).size();
    const { lut } = _.maxBy( orders, o => o.lut );
    const { createDate } = _.minBy( orders, o => o.createDate );

    orders.push( {
      countActiveTicket,
      countCancelledTicket,
      counterActiveServicesIsEmd: this.counterActiveServicesIsEmd,
      counterCancelledServicesIsEmd: this.counterCancelledServicesIsEmd,
      lut,
      createDate,
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
  };
  private ordersComposeMap = R.compose( this.ordersAmount, this.ordersMixing, this.orderSort );

  getBooking( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        this.retryRequestService.retry(),
        map( this.ordersComposeMap ),
      );
  }

}
