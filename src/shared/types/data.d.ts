import { Coords } from "./kakaoMap";

interface StoreItems {
  itemId: string;
  item: string;
  category: string;
  price: number;
}

export interface StoreData {
  storeId: string;
  storeName: string;
  phoneNumber: string;
  address: string;
  items: StoreItems[];
  latitude: number;
  longitude: number;
}

export interface StoreCategory {
  category: string;
  minPrice: number;
  maxPrice: number;
}

export interface MarketItem {
  itemId: string;
  itemName: string;
}

interface ItemList {
  itemId: string;
  itemName: string;
  average_price: number;
}

interface Market {
  marketId: string;
  marketName: string;
}

interface SavingList {
  marketItem: {
    itemId: string;
    itemName: string;
    price: number;
    sale: true;
  };
  saving: number;
}

interface RankList {
  rank: number;
  market: Market;
  savingList: SavingList[];
  totalSaving: number;
}

export interface Rank {
  itemList: ItemList[];
  rankList: RankList[];
}
