export interface IOptionGroups {
  groupName: string;
  option: {
    value: {
      controlName: string;
      controlGroupName: string;
      isDate: boolean;
    };
    viewValue: string;
  }[];
};

export const optionGroups: IOptionGroups[] = [
  {
    groupName: 'Сегмент',
    option: [
      {
        value: { controlName: 'depPoint', controlGroupName: 'segments', isDate: false },
        viewValue: 'Аэропорт вылета'
      },
      {
        value: { controlName: 'depTime', controlGroupName: 'segments', isDate: true },
        viewValue: 'Дата / время вылета'
      },
      {
        value: { controlName: 'arrPoint', controlGroupName: 'segments', isDate: false },
        viewValue: 'Аэропорт прилета'
      },
    ]
  }
];
