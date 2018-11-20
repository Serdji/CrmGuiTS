export interface IMenuLink {
  name: string;
  icon: string;
  claims?: string;
  link: {
    url: string;
    title: string;
  }[];
}
