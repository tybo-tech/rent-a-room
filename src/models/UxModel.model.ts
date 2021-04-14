export interface HomeNavUx {
  LogoUrl: string;
  Name: string;
}
export interface LoaderUx{
  Loading: boolean;
  Message?: string;
}

export interface MessageDialogUx {
  ShowDialog?: boolean;
  Message?: string;
  IsSuccess?: boolean;
  CtaLabel?: string;
  CtaNav?: string;
  IconUrl?: string;
  NavigateTo?: string;
}


export interface TablsModel {
  Name: string;
  Value: string;
  Class: string[];
  Icon: string;
}

export const tabsListDF: TablsModel[] = [
  { Name: 'Room', Value: 'Room', Class: ['active'], Icon: 'hiking' },
  { Name: 'Cottage', Value: 'Cottage', Class: [], Icon: 'local_florist' },
  { Name: 'Sharing', Value: 'House', Class: [], Icon: 'tour' },
  { Name: 'House', Value: 'House', Class: [], Icon: 'star' },
];