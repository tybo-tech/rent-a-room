import { Images } from "./images.model";

export class Experience {
  ExperienceId: string;
  CompanyId: string;
  Name: string;
  RegularPrice: number;
  PriceFrom: string;
  PriceTo: string;
  Description: string;
  Code: string;
  CatergoryId: string;
  ParentCategoryId: string;
  CategoryName: string;
  ParentCategoryName: string;
  ParentCategoryGuid: string;
  CategoryGuid: string;
  ExperienceSlug: string;
  FeaturedImageUrl: string;
  Notes: string;
  ExperienceType: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  Images?: Images[];
  IsBooked?: boolean;
}
