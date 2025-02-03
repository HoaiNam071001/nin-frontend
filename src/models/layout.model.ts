
export interface NavItem {
  icon: React.ReactNode | string;
  name: string;
  path: string;
  attach?: React.ReactNode;
}


export enum MenuType {
  NAV_BAR = 'NAV_BAR',
  USER_DROPDOWN = 'USER_DROPDOWN',
} 