import { Operation } from "./operation";

export class Expression {
  operations: Operation[] = [new Operation("0", "number")];

  result: number = 456;

  getOperation(): Operation[] {
    return this.operations;
  }

  setOperation(operations: Operation[]): void {
    this.operations = operations;
  }

  getResult(): number {
    return this.result;
  }

  setResult(result: number): void {
    this.result = result;
  }

  addOperation(operation: Operation) {
    this.operations.push(operation);
  }

  toString(): String {
    var s = "result";
    for (let index = 0; index < this.operations.length; index++) {
      s += this.operations[index].value;
    }
    return s;
  }
}