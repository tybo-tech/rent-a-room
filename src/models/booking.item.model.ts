export interface BookingItem {
  BookingItemId: string;
  BookingId: string;
  ServiceId: string;
  ServiceName: string;
  Infants: number;
  Children: number;
  Adults: number;
  ServicePrice: number;
  ServiceQuantity: number;
  ServiceTotal: number;
  Status: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  FeaturedImageUrl?: string;
}
