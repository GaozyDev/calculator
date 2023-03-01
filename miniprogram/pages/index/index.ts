// index.ts
import { Expression } from '../../model/expression';
import { Controller } from '../../controller/controller';
import { NumOperation } from '../../model/num_operation';

var controller = new Controller()

Page({
  data: {
    expressions: [
      new Expression(),
    ],
  },
  onLoad: function () {
    var expression: Expression = this.data.expressions[this.data.expressions.length - 1];
    expression.operations.push(new NumOperation("0", "number", 0));
    this.setData({
      expressions: this.data.expressions,
    });
  },
  inputNumber: function (e: any) {
    var value = e.currentTarget.dataset.value;
    const expressions = this.data.expressions;
    var expression: Expression = expressions[this.data.expressions.length - 1];
    expression = controller.input(expression, value);
    this.setData({
      expressions: expressions,
    });
  }
})
