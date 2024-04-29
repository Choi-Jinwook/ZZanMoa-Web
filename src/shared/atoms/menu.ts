import { Menu } from "@shared/types";
import { atom } from "recoil";

export const SelectedMenu = atom<Menu>({
  key: "SelectedMenu",
  default: "알뜰 가게 찾기",
});
