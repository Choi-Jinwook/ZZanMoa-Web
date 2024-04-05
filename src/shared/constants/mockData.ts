import { Coords, PlaceData } from "@shared/types";

export const mockMarker = (mapCenter: Coords): PlaceData[] => [
  { lat: mapCenter.lat + 0.001, lng: mapCenter.lng + 0.001, data: "test1" },
  { lat: mapCenter.lat - 0.001, lng: mapCenter.lng - 0.001, data: "test2" },
  { lat: mapCenter.lat - 0.001, lng: mapCenter.lng + 0.001, data: "test3" },
  { lat: mapCenter.lat + 0.001, lng: mapCenter.lng - 0.001, data: "test4" },
];
