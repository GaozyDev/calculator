import { Operation } from "./operation";

export class MathOperation extends Operation {

  constructor(key: string, type: string) {
    super(key, type);
    if(key == "/") {
      this.show = "÷";
    } else if(key == "*") {
      this.show = "x";
    }  else {
      this.show = key.toString();
    }
  }
}