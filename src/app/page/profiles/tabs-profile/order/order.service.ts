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
  private sumTEB = R.curry( ( moneyInfo: IMonetaryInfo, ticketOrEmd: string, code: string, amount: string ): number => {
    return _( moneyInfo )
      .filter( ticketOrEmd )
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  } );

//-------------------------------------------------------------------------------------------


//---------- Возвращает T E или B в зависимости от условия для суммирования валюты ----------
  private isTEB = R.curry( ( moneyInfo: IMonetaryInfo, ticketOrEmd: string ): string => {
    const isT = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'T' ] ).filter( 'Amount' ).size() !== 0;
    const isE = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'E' ] ).filter( 'Amount' ).size() !== 0;
    const isB = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'B' ] ).filter( 'Amount' ).size() !== 0;

    if ( isT ) return 'T';
    if ( !isT || isB ) return 'E';
    if ( !isT && !isB ) return 'E';
    if ( !isT && !isE ) return 'B';
  } );

//-------------------------------------------------------------------------------------------


//------------- Суммирования по всем заказам с учетам только активных заказов ---------------
  private sumAllTEB = R.curry( ( orders: any, code: string, amount: string ): number => {
    return _( orders )
      .filter( [ 'BookingStatus', 'Active' ] )
      .map( 'MonetaryInfo' )
      .flattenDeep()
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  } );

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
    return orders;
  } );
  private ordersMonetaryInfo = R.map( ( orders: any ) => {
    // ------------------------------------------ Пересчет валют в заказе ------------------------------------------
    if ( orders.MonetaryInfo ) {

      const money = orders.MonetaryInfo;
      const isTBEMoney = this.isTEB( money );

      const currency = _.chain( money )
        .filter( 'ticket' )
        .filter( [ 'Code', isTBEMoney( 'ticket' ) ] )
        .find( 'Currency' )
        .get( 'Currency' )
        .value();

      const ticketAmoTEB = _( money )
        .filter( 'ticket' )
        .filter( [ 'Code', isTBEMoney( 'ticket' ) ] )
        .sumBy( 'Amount' );


      // ------------------------- Сумма по каждой из валют в ticket --------------------------

      const sumMoney = this.sumTEB( money );

      const sumTicketIsTEB = sumMoney( 'ticket', isTBEMoney( 'ticket' ) );
      const sumTicketIsE = sumMoney( 'ticket', 'E' );
      const sumTicketIsB = sumMoney( 'ticket', 'B' );

      const ticketEurTEB = sumTicketIsTEB( 'AmountEur' );
      const ticketUsdTEB = sumTicketIsTEB( 'AmountUsd' );
      const ticketCurTEB = sumTicketIsTEB( 'AmountCur' );

      const ticketEurE = sumTicketIsE( 'AmountEur' );
      const ticketUsdE = sumTicketIsE( 'AmountUsd' );
      const ticketCurE = sumTicketIsE( 'AmountCur' );

      const ticketEurB = sumTicketIsB( 'AmountEur' );
      const ticketUsdB = sumTicketIsB( 'AmountUsd' );
      const ticketCurB = sumTicketIsB( 'AmountCur' );

      let subtractTicketEur, subtractTicketUsd, subtractTicketCur;

      // --------------------------------------------------------------------------------------


      // ------------------------- Сумма по каждой из валют в emd -----------------------------

      const sumEmdIsTEB = sumMoney( 'emd', isTBEMoney( 'emd' ) );
      const sumEmdIsE = sumMoney( 'emd', 'E' );
      const sumEmdIsB = sumMoney( 'emd', 'B' );

      const emdEurTEB = sumEmdIsTEB( 'AmountEur' );
      const emdUsdTEB = sumEmdIsTEB( 'AmountUsd' );
      const emdCurTEB = sumEmdIsTEB( 'AmountCur' );

      const emdEurE = sumEmdIsE( 'AmountEur' );
      const emdUsdE = sumEmdIsE( 'AmountUsd' );
      const emdCurE = sumEmdIsE( 'AmountCur' );

      const emdEurB = sumEmdIsB( 'AmountEur' );
      const emdUsdB = sumEmdIsB( 'AmountUsd' );
      const emdCurB = sumEmdIsB( 'AmountCur' );

      let subtractEmdEur, subtractEmdUsd, subtractEmdCur;

      // --------------------------------------------------------------------------------------

      let sumEur, sumUsd, SumCur;
      let sumEurT, sumUsdT, SumCurT;

      const isTicketE = _( money ).filter( 'ticket' ).filter( [ 'Code', 'E' ] ).size() !== 0;
      const isEmdE = _( money ).filter( 'emd' ).filter( [ 'Code', 'E' ] ).size() !== 0;

      // -------- Если в ticket есть хоть один элемент Code: E то вычитаем ticketT из ticketE, иначе из ticketB --------
      subtractTicketEur = ticketEurTEB - ( isTicketE ? ticketEurE : ticketEurB );
      subtractTicketUsd = ticketUsdTEB - ( isTicketE ? ticketUsdE : ticketUsdB );
      subtractTicketCur = ticketCurTEB - ( isTicketE ? ticketCurE : ticketCurB );
      // ---------------------------------------------------------------------------------------------------------------


      // -------------- Если в emd есть хоть один элемент Code: E то вычитаем emdT из emdE, иначе из emdB --------------
      subtractEmdEur = emdEurTEB - ( isEmdE ? emdEurE : emdEurB );
      subtractEmdUsd = emdUsdTEB - ( isEmdE ? emdUsdE : emdUsdB );
      subtractEmdCur = emdCurTEB - ( isEmdE ? emdCurE : emdCurB );
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
    const sumAll = this.sumAllTEB( orders );
    const sumAllTG = sumAll( 'TG' );
    const sumAllTE = sumAll( 'TE' );
    //------------ Общая сумма по всем заказам из ticket с условием TEB ------------
    const ticketCur = sumAllTG( 'AmountCur' );
    const ticketEur = sumAllTG( 'AmountEur' );
    const ticketUsd = sumAllTG( 'AmountUsd' );
    //------------------------------------------------------------------------------


    //-------------- Общая сумма по всем заказам из emd с условием TEB -------------
    const emdCur = sumAllTE( 'AmountCur' );
    const emdEur = sumAllTE( 'AmountEur' );
    const emdUsd = sumAllTE( 'AmountUsd' );
    //------------------------------------------------------------------------------


    const countActiveTicket = _( orders ).filter( [ 'BookingStatus', 'Active' ] ).size();
    const countCancelledTicket = _( orders ).filter( [ 'BookingStatus', 'Cancelled' ] ).size();
    const { lut } = _.maxBy( orders, o => o.lut );
    const { createDate } = _.minBy( orders, o => o.createDate );

    const totalAmountAppend = R.append( {
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
    return totalAmountAppend( orders );
  };
  private ordersComposeMap = R.compose( this.ordersAmount, this.ordersMonetaryInfo, this.ordersMixing, this.orderSort );

  getBooking( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        this.retryRequestService.retry(),
        map( this.ordersComposeMap ),
      );
  }

}
