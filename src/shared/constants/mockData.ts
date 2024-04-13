import { Coords, PlaceData, MarkerData } from "@shared/types";

// export const mockMarker = (mapCenter: Coords): PlaceData[] => [
//   { lat: mapCenter.lat + 0.001, lng: mapCenter.lng + 0.001, data: "test1" },
//   { lat: mapCenter.lat - 0.001, lng: mapCenter.lng - 0.001, data: "test2" },
//   { lat: mapCenter.lat - 0.001, lng: mapCenter.lng + 0.001, data: "test3" },
//   { lat: mapCenter.lat + 0.001, lng: mapCenter.lng - 0.001, data: "test4" },
// ];

export const mockMarker = (mapCenter: Coords): MarkerData[] => [
  { name: "신창시장", description: "전통 시장입니다." },
  { name: "신중앙시장", description: "중앙에 위치한 시장입니다." },
  { name: "백학시장", description: "백학동의 작은 시장입니다." },
  { name: "미성동도깨비시장", description: "도깨비 시장입니다." },
  { name: "망원시장", description: "망원동에 위치한 시장입니다." },
  { name: "동원시장", description: "동원동의 시장입니다." },
  { name: "가리봉시장", description: "가리봉동에 위치한 시장입니다." },
];