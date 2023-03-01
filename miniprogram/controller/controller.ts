import { Expression } from "../model/expression";
import { FunctionOperation } from "../model/function_operation";
import { MathOperation } from "../model/math_operation";
import { NumOperation } from "../model/num_operation";
import { Operation } from "../model/operation";

export class Controller {

  input(expression: Expression, key: any): Expression {
    var newOperation: Operation = this.buildOperation(key);
    this.pushNewOperation(expression, newOperation);
    this.startCalculate(expression);
    return expression;
  }

  startCalculate(expression: Expression) {
    var result: number = 0;
    var math = "+";
    for (var i = 0; i < expression.operations.length; i++) {
      var operation: Operation = expression.operations[i];
      if (operation.type == "number") {
        var numOperation: NumOperation = operation as NumOperation;
        result = this.calculate(result, numOperation.value, math);
      }

      if (operation.type == "math") {
        math = operation.key;
      }
    }
    expression.result = result;
  }

  calculate(result: number, value: number, math: string): number {
    if (math == "+") {
      return result + value;
    }
    if (math == "-") {
      return result - value;
    }
    if (math == "*") {
      return result * value;
    }
    if (math == "/") {
      return result / value;
    }
    return result;
  }

  pushNewOperation(expression: Expression, newOperation: Operation) {
    var operation: Operation = expression.operations[expression.operations.length - 1];
    if (operation.type == "number" && newOperation.type == "number") {
      var numOperation: NumOperation = operation as NumOperation;
      var newNumOperation: NumOperation = newOperation as NumOperation;
      if (numOperation.show == "0" && newNumOperation.show == "0") {
        return;
      }
      if (numOperation.show == "0" && newNumOperation.show != "0") {
        numOperation.show = newNumOperation.show;
        numOperation.value = parseFloat(numOperation.show);
        numOperation.key = newOperation.key;
        return;
      }

      numOperation.show += newNumOperation.key;
      numOperation.value = parseFloat(numOperation.show);
      numOperation.key = newOperation.key;
      return;
    }

    if (operation.type == "math" && newOperation.type == "math") {
      operation.key = newOperation.key;
      operation.show = newOperation.show;
      return;
    }

    if (operation.type == "number" && newOperation.type == "math") {
      expression.operations.push(newOperation);
      return;
    }

    if (operation.type == "math" && newOperation.type == "number") {
      expression.operations.push(newOperation);
      return;
    }

    if (newOperation.type == "function") {
      if (operation.key == "=" && newOperation.key == "=") {
        return;
      }
      if (newOperation.key == "=") {
        operation.key = "=";
      }
      if (newOperation.key == "ac") {
        expression.operations = [new NumOperation("0", "number", 0)];
      }
    }
  }

  buildOperation(key: any): Operation {
    if (key == "0"
      || key == "1"
      || key == "2"
      || key == "3"
      || key == "4"
      || key == "5"
      || key == "6"
      || key == "7"
      || key == "8"
      || key == "9"
      || key == "."
    ) {
      var value: number = 0;
      if (key == ".") {
        value = 0;
      } else {
        value = parseInt(key);
      }
      return new NumOperation(key, "number", value);
    }

    if (key == "+"
      || key == "-"
      || key == "*"
      || key == "/"
    ) {
      return new MathOperation(key, "math");
    }

    if (key == "ac"
      || key == "del" || key == "=") {
      return new FunctionOperation(key, "function");
    }

    return new Operation(key, "");
  }
}