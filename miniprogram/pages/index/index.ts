// index.ts
import { Expression } from '../../model/expression';
import { Controller } from '../../controller/controller';

Page({
  data: {
    results: [
      new Expression(),
      new Expression(),
      new Expression(),
    ],
    controller: new Controller()
  },
  inputNumber: function (e: any) {
    var value = e.currentTarget.dataset.value;

    const results = this.data.results;
    var expression: Expression = results[this.data.results.length - 1];
    expression = this.data.controller.input(expression, value);
    this.setData({
      results: results,
    });
  }
})
