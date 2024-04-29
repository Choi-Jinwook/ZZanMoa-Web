export interface Coords {
  lat: number;
  lng: number;
}

// export interface MarkerData {
//   name: string;
//   description: string; 
// }

// export interface MarkerState extends MarkerData {
//   id: number;
//   added: boolean;
//   focus: boolean;
// }

// export interface MarkerInfo {
//   id: number; 
//   name: string; 
//   description: string; 
//   added: boolean;
//   focus: boolean;
// }

export interface MarkerInfo {
  id: number;
  name: string;
  address: string;
  position: Coords;
  added: boolean;
  focus: boolean;
}
