import { Operation } from "./operation";

export class FunctionOperation extends Operation {

  constructor(key: string, type:string) {
    super(key, type);
    this.show = key.toString();
  }
}