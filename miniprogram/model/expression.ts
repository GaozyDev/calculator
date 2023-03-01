import { NumOperation } from "./num_operation";
import { Operation } from "./operation";

export class Expression {
  operations: Operation[] = [new NumOperation("0", "number", 0)];

  result: number = 0;
}