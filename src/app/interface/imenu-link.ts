export interface IMenuLink {
  name: string;
  icon?: string;
  link: {
    url: string;
    title: string;
  }[];
}
