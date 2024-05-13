import { Coords, MarkerInfo } from "@shared/types";
import { atom } from "recoil";

export const mapCenterState = atom<Coords>({
  key: "mapCenterState",
  default: { lat: 33.5563, lng: 126.79581 },
});

export const markersState = atom<MarkerInfo[]>({
  key: "markersState",
  default: [],
});

export const selectedLocationState = atom<string>({
  key: "selectedLocationState",
  default: "",
});

export const CurrentStore = atom<string>({
  key: "CurrentStore",
  default: "",
});
