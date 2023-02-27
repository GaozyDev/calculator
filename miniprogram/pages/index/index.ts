// index.ts
import { Operation } from '../../model/operation';
import { Result } from '../../model/result';

// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    results: [
      new Result(),
      new Result()
    ]
  },
  inputNumber: function (e: any) {
    var value = e.currentTarget.dataset.value;
    console.log(value);

    const results = this.data.results;
    results[0].operations.push(new Operation(value));
    this.setData({
      results: results,
    });
  }
})
