import { Expression } from "../model/expression";
import { FunctionOperation } from "../model/function_operation";
import { MathOperation } from "../model/math_operation";
import { NumOperation } from "../model/num_operation";
import { Operation } from "../model/operation";

export class Controller {

  input(expressions: Expression[], key: any): Expression[] {
    var newOperation: Operation = this.buildOperation(key);
    expressions = this.pushNewOperation(expressions, newOperation);
    var expression: Expression = expressions[expressions.length - 1];
    var splitExpressions: Expression[] = this.splitExpression(expression);
    console.log(splitExpressions);
    expression.result = this.startCalculate(splitExpressions);
    return expressions;
  }

  addExpression(expressions: Expression[]) {
    var expression: Expression = expressions[expressions.length - 1];
    var operationLast: Operation = expression.operations[expression.operations.length - 1];
    if (operationLast.key == "=") {
      var temp: Expression = new Expression();
      temp.operations.push(new NumOperation("0", "number", 0));
      expressions.push(temp);
    }
  }

  splitExpression(expression: Expression): Expression[] {
    var splitResult: Expression[] = [new Expression()];
    for (var i = 0; i < expression.operations.length; i++) {
      var operation: Operation = expression.operations[i];
      var expressionLast: Expression = splitResult[splitResult.length - 1];
      var prePriority: boolean = expressionLast.operations.length >= 2 &&
        (expressionLast.operations[expressionLast.operations.length - 1].key == "*" ||
          expressionLast.operations[expressionLast.operations.length - 1].key == "/");

      if (operation.key != "*" && operation.key != "/" && !prePriority) {
        // 当前不是乘除，并且上一个操作也不是乘除
        var priority = this.hasPriority(expressionLast);
        if (priority) {
          splitResult.push(new Expression());
          expressionLast = splitResult[splitResult.length - 1];
        }
      } else {
        // 当前是乘除或上一个操作是乘除
        var priority = this.hasPriority(expressionLast);
        if (!priority && expressionLast.operations.length >= 2) {
          var operationPre: Operation = expressionLast.operations.pop() as Operation;
          splitResult.push(new Expression());
          expressionLast = splitResult[splitResult.length - 1];
          expressionLast.operations.push(operationPre);
        }
      }
      expressionLast.operations.push(operation);
    }
    return splitResult;
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

  startCalculate(expressions: Expression[]): number {
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
          math2 = operation.key;
          if (j == expression.operations.length - 1) {
            if (math2 == "+" || math2 == "-") {
              math = math2;
            }
          }
        }
      }

      if (index == 0) {
        // 第一个算术式直接 0 + result2
        result = this.calculate(result, result2, "+");
      } else {
        result = this.calculate(result, result2, math);
      }
    }
    return result;
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

  pushNewOperation(expressions: Expression[], newOperation: Operation): Expression[] {
    if (newOperation.key != "ac" && newOperation.key != "del") {
      this.addExpression(expressions);
    }

    var expression: Expression = expressions[expressions.length - 1];
    var operationLast: Operation = expression.operations[expression.operations.length - 1];
    if (operationLast.type == "number" && newOperation.type == "number") {
      var numOperation: NumOperation = operationLast as NumOperation;
      var newNumOperation: NumOperation = newOperation as NumOperation;
      // 0 输入0
      if (numOperation.show == "0" && newNumOperation.show == "0") {
        return expressions;
      }
      // 0 输入非0数字
      if (numOperation.show == "0" && newNumOperation.show != "0") {
        numOperation.show = newNumOperation.show;
        numOperation.value = parseFloat(numOperation.show);
        numOperation.key = newOperation.key;
        return expressions;
      }

      // 非0数字 输入非0数字
      numOperation.show += newNumOperation.key;
      numOperation.value = parseFloat(numOperation.show);
      numOperation.key = newOperation.key;
      return expressions;
    }

    // 运算符 运算符
    if (operationLast.type == "math" && newOperation.type == "math") {
      operationLast.show = newOperation.show;
      operationLast.key = newOperation.key;
      return expressions;
    }

    // 数字 运算符
    if (operationLast.type == "number" && newOperation.type == "math") {
      expression.operations.push(newOperation);
      return expressions;
    }

    // 运算符 数字
    if (operationLast.type == "math" && newOperation.type == "number") {
      expression.operations.push(newOperation);
      return expressions;
    }

    // 功能键
    if (newOperation.type == "function") {
      // = =
      if (operationLast.key == "=" && newOperation.key == "=") {
        return expressions;
      }

      // 归零键
      if (newOperation.key == "ac") {
        // 如果最后一个算术式是“0”，那么重置所有算术式，否则只需重置最后一个
        if (expression.operations.length == 1 && expression.operations[0].key == "0") {
          var exp = new Expression();
          exp.operations = [new NumOperation("0", "number", 0)];
          expressions = [exp];
        } else {
          expression.operations = [new NumOperation("0", "number", 0)];
        }
        return expressions;
      }

      // 删除键
      if (newOperation.key == "del" && operationLast.key != "=") {
        // “0” 无需删除
        if (expression.operations.length == 1 && operationLast.show == "0") {
          return expressions;
        }

        if (operationLast.type = "number") {

          // 只有一个数字
          if (expression.operations.length == 1) {
            expression.operations = [new NumOperation("0", "number", 0)];
            return expressions;
          }

          var numOperation: NumOperation = operationLast as NumOperation;
          numOperation.show = numOperation.show.substr(0, numOperation.show.length - 1);
          if (numOperation.show.length == 0) {
            expression.operations.pop();
          } else {
            numOperation.value = parseFloat(numOperation.show);
          }
          return expressions;
        }

        if (operationLast.type = "math") {
          expression.operations.pop();
          return expressions;
        }
      }

      if (newOperation.key == "%") {
        if (operationLast.key == "=") {
          expression.result /= 100;
          return expressions;
        } else if (operationLast.type == "number" && operationLast.key != "%") {
          var numOperation: NumOperation = operationLast as NumOperation;
          numOperation.value /= 100;
          numOperation.show = numOperation.value.toString();
          numOperation.key = "%";
          return expressions;
        }
      }

      if (newOperation.key == "=") {
        operationLast.key = "=";
        return expressions;
      }
    }
    return expressions;
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