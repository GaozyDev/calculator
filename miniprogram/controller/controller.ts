import { Expression } from "../model/expression";
import { FunctionOperation } from "../model/function_operation";
import { MathOperation } from "../model/math_operation";
import { NumOperation } from "../model/num_operation";
import { Operation } from "../model/operation";

export class Controller {

  input(expression: Expression, key: any): Expression {
    var newOperation: Operation = this.buildOperation(key);
    this.pushNewOperation(expression, newOperation);
    var expressions: Expression[] = this.splitExpression(expression);
    console.log(expression);
    this.startCalculate(expression, expressions);
    return expression;
  }

  splitExpression(expression: Expression): Expression[] {
    var expressions: Expression[] = [new Expression()];
    for (var i = 0; i < expression.operations.length; i++) {
      var operation: Operation = expression.operations[i];
      var expressionLast: Expression = expressions[expressions.length - 1];
      var prePriority: boolean = expressionLast.operations.length >= 2 &&
        (expressionLast.operations[expressionLast.operations.length - 1].key == "*" ||
          expressionLast.operations[expressionLast.operations.length - 1].key == "/");
      if (operation.key != "*" && operation.key != "/"
        && !prePriority) {
        var priority = this.hasPriority(expressionLast);
        if (priority) {
          expressions.push(new Expression());
          expressionLast = expressions[expressions.length - 1];
        }
        expressionLast.operations.push(operation);
      } else {
        var priority = this.hasPriority(expressionLast);
        if (!priority && expressionLast.operations.length >= 2) {
          var operationPre: Operation = expressionLast.operations.pop() as Operation;
          expressions.push(new Expression());
          expressionLast = expressions[expressions.length - 1];
          expressionLast.operations.push(operationPre);
        }
        expressionLast.operations.push(operation);
      }
    }
    return expressions;
  }

  hasPriority(expression: Expression): boolean {
    for (let i = 0; i < expression.operations.length; i++) {
      const operation = expression.operations[i];
      if (operation.key == "*" || operation.key == "/") {
        return true;
      }
    }
    return false;
  }

  startCalculate(expression: Expression, expressions: Expression[]) {
    var operationLast: Operation = expression.operations[expression.operations.length - 1];
    if (operationLast.key == "=") {
      return;
    }

    var result: number = 0;
    var math = "+";

    for (let index = 0; index < expressions.length; index++) {
      const expression: Expression = expressions[index];
      var result2: number = 0;
      var math2 = "+";

      for (var j = 0; j < expression.operations.length; j++) {
        var operation: Operation = expression.operations[j];
        if (operation.type == "number") {
          var numOperation: NumOperation = operation as NumOperation;
          result2 = this.calculate(result2, numOperation.value, math2);
        }

        if (operation.type == "math") {
          if (j != expression.operations.length - 1) {
            math2 = operation.key;
          } else {
            math = operation.key;
            if (math == "*" || math == "/") {
              result = this.calculate(result, result2, math);
              return;
            }
          }
        }
      }

      result = this.calculate(result, result2, math);
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
    var operationLast: Operation = expression.operations[expression.operations.length - 1];
    
    if (operationLast.type == "number" && newOperation.type == "number") {
      if(operationLast.key == "=") {
        return;
      }

      var numOperation: NumOperation = operationLast as NumOperation;
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

    if (operationLast.type == "math" && newOperation.type == "math") {
      if(operationLast.key == "=") {
        return;
      }

      operationLast.show = newOperation.show;
      operationLast.key = newOperation.key;
      return;
    }

    if (operationLast.type == "number" && newOperation.type == "math") {
      if(operationLast.key == "=") {
        return;
      }

      expression.operations.push(newOperation);
      return;
    }

    if (operationLast.type == "math" && newOperation.type == "number") {
      if(operationLast.key == "=") {
        return;
      }

      expression.operations.push(newOperation);
      return;
    }

    if (newOperation.type == "function") {
      if (operationLast.key == "=" && newOperation.key == "=") {
        return;
      }

      if (newOperation.key == "ac") {
        expression.operations = [new NumOperation("0", "number", 0)];
        return;
      }

      if (newOperation.key == "del" && operationLast.key != "=") {
        if (expression.operations.length == 1 && operationLast.show == "0") {
          return;
        }

        if (expression.operations.length == 1 && operationLast.show.length == 1) {
          expression.operations = [new NumOperation("0", "number", 0)];
          return;
        }

        if (operationLast.type = "number") {
          var numOperation: NumOperation = operationLast as NumOperation;
          numOperation.show = numOperation.show.substr(0, numOperation.show.length - 1);
          if (numOperation.show.length == 0) {
            expression.operations.pop();
          } else {
            numOperation.value = parseFloat(numOperation.show);
          }
          return;
        }

        if (operationLast.type = "math") {
          expression.operations.pop();
          return;
        }
        return;
      }

      if (newOperation.key == "%") {
        if (operationLast.key == "=") {
          expression.result /= 100;
          return;
        } else if (operationLast.type == "number" && operationLast.key != "%") {
          var numOperation: NumOperation = operationLast as NumOperation;
          numOperation.value /= 100;
          numOperation.show = numOperation.value.toString();
          numOperation.key = "%";
          return;
        }
      }

      if (newOperation.key == "=") {
        operationLast.key = "=";
        return;
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
      || key == "del" || key == "=" || key == "%") {
      return new FunctionOperation(key, "function");
    }

    return new Operation(key, "");
  }
}