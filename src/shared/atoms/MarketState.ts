import { atom } from "recoil";
import { MarkerInfo } from "@shared/types/kakaoMap";

const selectedMarketsState = atom<MarkerInfo[]>({
    key: 'selectedMarketsState',
    default: [],
});

export default selectedMarketsState;