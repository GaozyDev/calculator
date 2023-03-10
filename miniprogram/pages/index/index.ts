// index.ts
import { Expression } from '../../model/expression';
import { Controller } from '../../controller/controller';
import { NumOperation } from '../../model/num_operation';

var controller = new Controller()

Page({
  data: {
    expressions: [new Expression()],
  },
  onLoad: function () {
    var value = wx.getStorageSync('expressions')
    console.log(value)
    if(value != null && value != "") {
      this.setData({
        expressions: JSON.parse(value),
      });
    } else {
      this.data.expressions.pop();
      var expression: Expression = new Expression();
      expression.operations.push(new NumOperation("0", "number", 0));
      this.data.expressions.push(expression);
      this.setData({
        expressions: this.data.expressions,
      });
    }
  },
  input: function (e: any) {
    wx.vibrateShort({
      type: "medium"
    });

    var value = e.currentTarget.dataset.value;
    const expressions = controller.input(this.data.expressions, value);
    this.setData({
      expressions: expressions,
    });
    wx.setStorageSync('expressions', JSON.stringify(expressions))
  },
})
