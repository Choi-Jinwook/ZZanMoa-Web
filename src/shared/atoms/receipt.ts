import { Rank } from "@shared/types";
import { atom } from "recoil";

export const rank = atom<Rank | null>({
  key: "rank",
  default: null,
});
