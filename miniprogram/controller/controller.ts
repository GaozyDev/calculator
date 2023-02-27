import { Expression } from "../model/expression";
import { Operation } from "../model/operation";

export class Controller {

  a = "!23";

  input(expression: Expression, value: any) : Expression {
    expression.addOperation(new Operation(value, "number"));
    return expression;
  }
}