export interface Coords {
  lat: number;
  lng: number;
}

export interface MarkerInfo {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  added: boolean;
  focus: boolean;
}
