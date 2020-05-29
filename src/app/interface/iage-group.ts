export interface IAgeGroup {
  ageGroup: IAgeGroups[];
}

export interface IAgeGroups {
  id?: number;
  ageTo: number;
  ageFrom: number;
  gender: 'f' | 'm';
  title: string;
}
