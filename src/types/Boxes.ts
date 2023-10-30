export interface IBoxesSheets {
  Name: string;
  Latitude: string;
  Longitude: string;
  Type: string;
  Level: number;
}

export interface IBoxes {
  name: string;
  lat: number;
  lng: number;
  boxType: string;
  implanted: boolean;
  project: string;
  hierarchyLevel: number;
  coords: Number[];
}
