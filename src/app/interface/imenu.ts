export interface IMenu {
  name: string;
  icon: string;
  claims?: string;
  link: {
    url: string;
    title: string;
  }[];
}
