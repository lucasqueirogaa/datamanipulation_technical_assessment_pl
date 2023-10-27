export interface IBoxesSheets {
  Name: String;
  Latitude: String;
  Longitude: String;
  Type: String;
  Level: Number;
}

export interface IBoxes {
  project: string;
  draft: boolean;
  implanted: boolean;
  certified: boolean;
  hierarchyLevel: number;
  template: string;
  boxType: string;
  name: string;
  coords: Number[];
  lat: string;
  lng: string;
}
