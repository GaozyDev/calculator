import { Operation } from "./operation";

export class NumOperation extends Operation {
  value: number = 0;

  constructor(key: string, type: string, value: number) {
    super(key, type);
    this.value = value;
    if (key == ".") {
      this.show = "0.";
    } else {
      this.show = key.toString();
    }
  }
}