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
