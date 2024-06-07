import { atom } from "recoil";

export const saleContent = atom<{ title: string; content: string }>({
  key: "saleContent",
  default: { title: "", content: "" },
});

export const CurrentPageNumber = atom<number>({
  key: "CurrentPageNumber",
  default: 1,
});
