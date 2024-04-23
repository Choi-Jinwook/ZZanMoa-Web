import { atom } from "recoil";

export const CurrentPrice = atom<{ minPrice: number; maxPrice: number }>({
  key: "CurrentPrice",
  default: { minPrice: 0, maxPrice: 50000 },
});

export const Range = atom<{ start: number; end: number }>({
  key: "PriceRange",
  default: { start: 0, end: 0 },
});
