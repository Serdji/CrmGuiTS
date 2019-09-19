export interface IOptionValue {
  controlName: string[];
  controlGroupName: string;
  isDate: boolean;
}

export interface IOptionGroups {
  groupName: string;
  option: {
    value: IOptionValue;
    viewValue: string;
  }[];
}


export const optionGroups: IOptionGroups[] = [
  {
    groupName: 'Поиск по всем параметрам',
    option: [
      {
        value: { controlName: [ 'all' ], controlGroupName: 'all', isDate: false },
        viewValue: 'Любой'
      },
    ]
  },
  {
    groupName: 'Точка продажи',
    option: [
      {
        value: { controlName: [ 'distrRecloc', 'recloc' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'Recloc GDS'
      },
      {
        value: { controlName: [ 'gds' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'GDS'
      },
      {
        value: { controlName: [ 'posId' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'POS ID'
      },
      {
        value: { controlName: [ 'agency' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'Агентство'
      },
      {
        value: { controlName: [ 'termId' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'Терминал'
      },
      {
        value: { controlName: [ 'country' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'Страна'
      },
    ]
  },
  {
    groupName: 'Сегмент',
    option: [
      {
        value: { controlName: [ 'arrPoint' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'Аэропорт прилета'
      },
      {
        value: { controlName: [ 'depTime' ], controlGroupName: 'segments', isDate: true },
        viewValue: 'Дата / время вылета'
      },
      {
        value: { controlName: [ 'depPoint' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'Аэропорт вылета'
      },
      {
        value: { controlName: [ 'arrTime' ], controlGroupName: 'segments', isDate: true },
        viewValue: 'Дата / время прилета'
      },
      {
        value: { controlName: [ 'flight' ], controlGroupName: 'segments', isDate: false },
        viewValue: '№ рейса'
      },
      {
        value: { controlName: [ 'cabin' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'Кабина'
      },
      {
        value: { controlName: [ 'rbd' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'Класс бронирования'
      },
      {
        value: { controlName: [ 'status' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'Статус сегмента'
      },
    ]
  },
  {
    groupName: 'Билет',
    option: [
      {
        value: { controlName: [ 'segment', 'arrPoint' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Аэропорт прилета'
      },
      {
        value: { controlName: [ 'segment', 'depTime' ], controlGroupName: 'tickets', isDate: true },
        viewValue: 'Дата / время вылета'
      },
      {
        value: { controlName: [ 'segment', 'depPoint' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Аэропорт вылета'
      },
      {
        value: { controlName: [ 'segment', 'arrTime' ], controlGroupName: 'tickets', isDate: true },
        viewValue: 'Дата / время прилета'
      },
      {
        value: { controlName: [ 'ticket' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Номер билета'
      },
      {
        value: { controlName: [ 'coupon' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Номер купона'
      },
      {
        value: { controlName: [ 'FareCode' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Fare basis'
      },
      {
        value: { controlName: [ 'couponStatus' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'Статус'
      },
    ]
  },
  {
    groupName: 'Услуги',
    option: [
      {
        value: { controlName: [ 'emdType' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Тип SVC'
      },
      {
        value: { controlName: [ 'segment', 'arrPoint' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Аэропорт прилета'
      },
      {
        value: { controlName: [ 'segment', 'depTime' ], controlGroupName: 'services', isDate: true },
        viewValue: 'Дата / время вылета'
      },
      {
        value: { controlName: [ 'segment', 'depPoint' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Аэропорт вылета'
      },
      {
        value: { controlName: [ 'segment', 'arrTime' ], controlGroupName: 'services', isDate: true },
        viewValue: 'Дата / время прилета'
      },
      {
        value: { controlName: [ 'segment', 'flight' ], controlGroupName: 'services', isDate: false },
        viewValue: '№ рейса'
      },
      {
        value: { controlName: [ 'status' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Статус услуги'
      },
      {
        value: { controlName: [ 'nos' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Название услуги'
      },
      {
        value: { controlName: [ 'text' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Комментарий'
      },
      {
        value: { controlName: [ 'rfisc' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Rfisc'
      },
      {
        value: { controlName: [ 'ssr' ], controlGroupName: 'services', isDate: false },
        viewValue: 'SSR'
      },
      {
        value: { controlName: [ 'emd', 'coupon' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Номер купона'
      },
      {
        value: { controlName: [ 'emdType' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Тип EMD'
      },
      {
        value: { controlName: [ 'couponStatus' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Статус'
      },
      {
        value: { controlName: [ 'emd', 'num' ], controlGroupName: 'services', isDate: false },
        viewValue: 'EMD'
      },
      {
        value: { controlName: [ 'qtty' ], controlGroupName: 'services', isDate: false },
        viewValue: 'Количество'
      },
    ]
  }
];



















