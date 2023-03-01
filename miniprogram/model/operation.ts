export class Operation {
  key: string;
  type: string;
  show: string = "";
  
  constructor(key: string, type: string) {
    this.key = key;
    this.type = type;
  }
}