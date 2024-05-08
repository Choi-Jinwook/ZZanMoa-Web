export interface Coords {
  lat: number;
  lng: number;
}

export interface MarkerInfo {
  id: number;
  name: string;
  address: string;
  position: Coords;
  added: boolean;
  focus: boolean;
}
