import { Base } from "./base";

export class Operation extends Base {
  constructor(value: string) {
    super(value);
  }

  temp: string = "456";

  getTemp(): string {
    return this.temp;
  }
}