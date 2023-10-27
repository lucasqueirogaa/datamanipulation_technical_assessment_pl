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
  input: Number;
  output: Number;
}

export interface ISplitters {
  implanted: Boolean;
  isDrop: Boolean;
  parent: String;
  project: String;
  name: String;
  splitterType: String;
  ratio: ISplittersRatio;
}
