export interface ISplittersSheets {
  Name: String;
  Type: String;
  Box: String;
  Implanted: String;
  Inputs: Number;
  Outputs: Number;
  "Allows client connection": String;
}

interface ISplittersRatio {
  input: number;
  output: number;
}

export interface ISplitters {
  implanted: boolean;
  isDrop: boolean;
  parent: string;
  project: string;
  name: string;
  splitterType: string;
  ratio: ISplittersRatio;
}
