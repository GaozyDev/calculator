import { Base } from "./base";

export class Operation extends Base {
  constructor(value: string, type:string) {
    super(value, type);
  }

  temp: string = "456";

  getTemp(): string {
    return this.temp;
  }
}