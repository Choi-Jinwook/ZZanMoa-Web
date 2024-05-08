import { atom } from "recoil";

export const SelectedCategory = atom<string>({
  key: "SelectedCategory",
  default: "한식",
});

export const MinMaxPrice = atom<{ minPrice: number; maxPrice: number }>({
  key: "MinMaxPrice",
  default: { minPrice: 0, maxPrice: 50000 },
});
