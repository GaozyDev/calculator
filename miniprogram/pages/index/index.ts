// index.ts
import { Expression } from '../../model/expression';
import { Controller } from '../../controller/controller';

var controller = new Controller()

Page({
  data: {
    expressions: [
      new Expression(),
    ],
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
