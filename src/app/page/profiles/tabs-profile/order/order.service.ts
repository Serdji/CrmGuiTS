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


// ---------------------------------- Суммирования валюты -----------------------------------
  private sumTEB = R.curry( ( moneyInfo: IMonetaryInfo, ticketOrEmd: string, code: string, amount: string ): number => {
    return _( moneyInfo )
      .filter( ticketOrEmd )
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  } );

// -------------------------------------------------------------------------------------------


// ---------- Возвращает T E или B в зависимости от условия для суммирования валюты ----------
  private isTEB = R.curry( ( moneyInfo: IMonetaryInfo, ticketOrEmd: string ): string => {
    const isT = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'T' ] ).filter( 'Amount' ).size() !== 0;
    const isE = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'E' ] ).filter( 'Amount' ).size() !== 0;
    const isB = _( moneyInfo ).filter( ticketOrEmd ).filter( [ 'Code', 'B' ] ).filter( 'Amount' ).size() !== 0;

    if ( isT ) return 'T';
    if ( !isT || isB ) return 'E';
    if ( !isT && !isB ) return 'E';
    if ( !isT && !isE ) return 'B';
  } );

// -------------------------------------------------------------------------------------------


// ------------- Суммирования по всем заказам с учетам только активных заказов ---------------
  private sumAllTEB = R.curry( ( orders: any, code: string, amount: string ): number => {
    return _( orders )
      .filter( [ 'BookingStatus', 'Active' ] )
      .map( 'MonetaryInfo' )
      .flattenDeep()
      .filter( [ 'Code', code ] )
      .sumBy( amount );
  } );

// -------------------------------------------------------------------------------------------

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
  
  // ------------------------------------------ Обнуление валют в коде B если есть C ------------------------------------------
  private ordersMoneyIsCZeroB = ( orders: any ) => {

    const propEqB = R.propEq( 'Code', 'B' );
    const propEqC = R.propEq( 'Code', 'C' );
    const AmountLens = R.lensProp( 'Amount' );
    const AmountCurLens = R.lensProp( 'AmountCur' );
    const AmountEurLens = R.lensProp( 'AmountEur' );
    const AmountUsdLens = R.lensProp( 'AmountUsd' );
    const setAmount = lens => R.set( lens, 0 );
    // @ts-ignore
    const setAmountCompose = R.compose( setAmount( AmountLens ), setAmount( AmountCurLens ), setAmount( AmountEurLens ), setAmount( AmountUsdLens ) );

    // --------------------------- Груперовка валют по ticket и emd ---------------------------
    const groupByMoney = R.groupBy( ( money: IMonetaryInfo ) => money.ticket ? money.ticket : money.emd );
    const groupByResult = ( money: IMonetaryInfo[] ) => groupByMoney( money );
    // ----------------------------------------------------------------------------------------

    // ----------------------------- Маппинг валют по парамтру B ------------------------------
    const mapMoneyCodeIsB = R.map( ( money: IMonetaryInfo ) => {
      if ( propEqB( money ) ) {
        return setAmountCompose( money ); // Обнуление валют в B
      }
      return money;
    } );
    // -----------------------------------------------------------------------------------------

    // -------------------- Маппинг сгруперованных валют по ticket и emd -----------------------
    const mapMoneyIsCZeroB = R.map( ( money: IMonetaryInfo[] ) => {
      let moneyIsC = false;
      R.map( item => moneyIsC = propEqC( item ), money );
      if ( moneyIsC ) return mapMoneyCodeIsB( money ); // Передать группу в которой есть C для маппинга
    } );
    // ------------------------------------------------------------------------------------------

    // --------------------------- Отфильтровать параметр только по B ---------------------------
    const filterMoneyCodeB = money => R.filter( propEqB, money );
    // ------------------------------------------------------------------------------------------

    // ---------------------------- Условия удаления валют с кодом B  ---------------------------
    const ticketRemoveIsB = ( money, result ) => money.ticket === result.ticket && money.Code === 'B' && money.Amount !== 0;
    const emdRemoveIsB = ( money, result ) => money.emd === result.emd && money.Code === 'B' && money.Amount !== 0;
    // ------------------------------------------------------------------------------------------

    // ---------------------------- Передаем все функции в компазицию ----------------------------
    const groupResultCompose = R.compose( filterMoneyCodeB, R.flatten, _.compact, mapMoneyIsCZeroB, R.values, groupByResult );
    // ------------------------------------------------------------------------------------------

    // ----------------------- Маппируем orders для работы с MonetaryInfo -----------------------
    const mapOrdersMoney = R.map( ( order: any ) => {
      if ( order.MonetaryInfo ) {
        const results = groupResultCompose( order.MonetaryInfo ); // Передаем в компазицию параметр MonetaryInfo
        if ( !R.isEmpty( results ) ) { // Избавляемся от пустых массивов
          R.map( result => {
            order.MonetaryInfo.push( result ); // Добавляем в MonetaryInfo результат обнуленных валют с кодом B

            // ----- Удаление валют с кодом B, но остаются нулевые валюы с кодом B -----
            _.remove( order.MonetaryInfo, ( money: IMonetaryInfo ) => money.ticket ? ticketRemoveIsB( money, result ) : emdRemoveIsB( money, result ) );
            // -------------------------------------------------------------------------

          }, results );
        }
      }
    } );
    // ------------------------------------------------------------------------------------------

    mapOrdersMoney( orders ); // Запуск замены валют

    return orders;
  };
  
  // ------------------------------------------ Пересчет валют в заказе ------------------------------------------
  private ordersMonetaryInfo = R.map( ( orders: any ) => {
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
    
    // ------------ Общая сумма по всем заказам из ticket с условием TEB ------------
    const ticketCur = sumAllTG( 'AmountCur' );
    const ticketEur = sumAllTG( 'AmountEur' );
    const ticketUsd = sumAllTG( 'AmountUsd' );
    // ------------------------------------------------------------------------------


    // -------------- Общая сумма по всем заказам из emd с условием TEB -------------
    const emdCur = sumAllTE( 'AmountCur' );
    const emdEur = sumAllTE( 'AmountEur' );
    const emdUsd = sumAllTE( 'AmountUsd' );
    // ------------------------------------------------------------------------------


    const countActiveTicket = _( orders ).filter( [ 'BookingStatus', 'Active' ] ).size();
    const countCancelledTicket = _( orders ).filter( [ 'BookingStatus', 'Cancelled' ] ).size();
    const { lut } = _.maxBy( orders, o => o.lut );
    const { createDate } = _.minBy( orders, o => o.createDate );

    const appendTotalAmount = R.append( {
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
    this.counterActiveServicesIsEmd = 0;
    this.counterCancelledServicesIsEmd = 0;
    return appendTotalAmount( orders );
  };

  private ordersComposeMap = R.compose( this.ordersAmount, this.ordersMonetaryInfo, this.ordersMoneyIsCZeroB, this.ordersMixing, this.orderSort );

  getBooking( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        this.retryRequestService.retry(),
        map( this.ordersComposeMap ),
      );
  }

}
