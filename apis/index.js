var Mock = require('../utils/mock.js');
var directory = Mock.mock({
  'list|9': [
    {
      'id|+1': 1,
      'type': '@ctitle(2,5)',
      'children|4-15': [
        {
          'id|+1': 1,
          'name': '@ctitle(3,10)',
          'img': 'https://zhgroot.cn/educational_administration_system/Public/img/bg.jpg'
        }
      ]
    }
  ]
});
// res = Mock.mock({
//   'success': true,
//   'msg': '',
//   'result': {
//     'accountToken': 'dcbbd581feed460d9719bdb86540c4d7'
//   }
// })
function ajax(url){
  var res='';
  switch(url){
    /**
     * post
     * 不需要授权
     * {code}
     */
    case 'api/account/login':
      res = Mock.mock({
          'accountToken':'dcbbd581feed460d9719bdb86540c4d7'
      })
    break;
    /**
     * get
     * 不需要授权
     */
    case 'api/getBanner':
      res = Mock.mock({
          'list|3': [{
            'id|+1': 1,
            'img': "https://zhgroot.cn/educational_administration_system/Public/img/bg.jpg",
          }]
      })
    break;
    /**
     * get
     * 不需要授权
     */
    case 'api/getClassify':
      res = Mock.mock({
        'list|8':[{
          'id|+1':1,
          'name': '@ctitle(2,4)',
          'img':'https://zhgroot.cn/educational_administration_system/Public/img/bg.jpg'
        }]
      })
    break;
    /**
     * get
     * 需要授权
     */
    case 'api/getAchievement':
      res = Mock.mock({
        'walk':'@integer(1000,20000)',
        'kilo':'@integer(1,200)'
      })
    break;
    /**
     * get
     * 不需要授权
     */
    case 'api/getRecommend':
      res = Mock.mock({
        'list|4':[
          {
            'id|+1':1,
            'img':'https://zhgroot.cn/educational_administration_system/Public/img/bg.jpg',
            'name':'@ctitle(5,15)',
            'money':'@float(100, 2000, 0, 2)'
          }
        ]
      })
    break;
    /**
     * get
     * 不需要授权
     */
    case 'api/getDirectory':
      res = directory;
    break;
  }
  return res;
}
module.exports = {
  ajax: ajax
}
