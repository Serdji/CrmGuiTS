export interface ITabsControlData {
  selectedIndex: number;
  order?: {
    recLocGDS: string;
  };
  message?: {
    distributionId: number;
  };
  promoCode?: {
    promoCodeId: number;
  };
}
