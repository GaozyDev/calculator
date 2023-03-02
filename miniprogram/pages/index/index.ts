// index.ts
import { Expression } from '../../model/expression';
import { Controller } from '../../controller/controller';
import { NumOperation } from '../../model/num_operation';

var controller = new Controller()

Page({
  data: {
    expressions: [new Expression()],
    hideResult: true
  },
  onLoad: function () {
    this.data.expressions.pop();
    var expression: Expression = new Expression();
    expression.operations.push(new NumOperation("0", "number", 0));
    this.data.expressions.push(expression);
    this.setData({
      expressions: this.data.expressions,
      hideResult: this.hideResult(),
    });
  },
  input: function (e: any) {
    var value = e.currentTarget.dataset.value;
    const expressions = this.data.expressions;
    var expression: Expression = expressions[this.data.expressions.length - 1];
    expression = controller.input(expression, value);

    this.setData({
      expressions: expressions,
      hideResult: this.hideResult(),
    });
  },
  hideResult: function () {
    return this.data.expressions.length == 1 && this.data.expressions[0].operations.length == 1
      && this.data.expressions[0].operations[0].key == "0";
  }
})
