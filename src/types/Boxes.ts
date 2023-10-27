export interface IBoxesSheets {
  Name: String;
  Latitude: String;
  Longitude: String;
  Type: String;
  Level: Number;
}

export interface IBoxes {
  name: string;
  lat: string;
  lng: string;
  boxType: string;
  implanted: boolean;
  project: string;
  hierarchyLevel: number;
  coords: Number[];
}
