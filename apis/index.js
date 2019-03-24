var Mock = require('../utils/mock.js');
function ajax(url){
  var res='';
  switch(url){
    case 'api/getBanner':
      res = Mock.mock({
        'success': true,
        'msg': '',
        'result|10': [{
          'id|+1': 1,
          'img': "@image('200x100', '#4A7BF7','#fff','pic')",
          'title': '@ctitle(3,8)',
          'city': "@county(true)",
          'stock_num': '@integer(0,100)',//库存数量  
          'marketing_start': '@datetime()',
          'marketing_stop': '@now()',
          'price': '@integer(100,2000)',//现价，单位：分  
          'original_price': '@integer(100,3000)'
        }]
      })
    break;
  }
  return res;
}
module.exports = {
  ajax: ajax
}
