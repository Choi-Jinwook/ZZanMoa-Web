import { atom } from "recoil";

export const saleContent = atom<{ title: string; content: string }>({
  key: "saleContent",
  default: { title: "", content: "" },
});
