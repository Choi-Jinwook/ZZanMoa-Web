import { atom } from 'recoil';
import { StoreData } from '@shared/types';

export const storeMarkerState = atom<StoreData[]>({
  key: 'storeMarkerState',
  default: [],
});