/**
 * 用promise封装仅供本项目使用,放到其他项目需要修改
 * url地址
 * isLoading：bol值是否显示loading
 * page对象
 * app，应用对象
 * needsAuth：bol值是否需要授权
 * isMock:bol 是否需要mock数据
 */
import Promise from './promise.js'
import Mock from '../apis/index.js'
function Get(url, isLoading, page, app, needsAuth, isMock) {
  var token = app.globalData.token;
  if (isLoading) {
    page.setData({
      isLoading: true
    })
  }
  if (isMock){
    var res1= Mock.ajax(url);
    return new Promise((res,rej)=>{
      res(res1);
    })
  }
  if (needsAuth){
    return getPromise(url, token);
  }else{
    return getPromisenoauth(url);
  }
}
/**
 * 封装post方法
 */
function Post(url, data, isLoading, page,app, needsAuth, isMock) {
  var token = app.globalData.token;
  if (isLoading) {
    page.setData({
      isLoading: true
    })
  }
  if (isMock) {
    return Mock.ajax(url);
  }
  if (needsAuth) {
    return postpromise(url, data, token);
  } else {
    return postpromisenoauth(url, data);
  }
}
/**
 * 封装delete方法
 */
function Delete(url, isLoading, page, app, needsAuth, isMock){
  var token = app.globalData.token;
  if (isLoading) {
    page.setData({
      isLoading: true
    })
  }
  if(isMock){
    return Mock.ajax(url);
  }
  if (needsAuth) {
    return deletePromise(url, token);
  } else {
    return deletePromisenoauth(url);
  }
}
function deletePromise(url, token) {
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'DELETE',
      header: {
        AccountToken: token
      },
      success: function (result) {
        var data = result.data;
        var msg=data.msg;
        if (!data.success) {
          rej(msg);
        } else {
          res(msg);
        }
      },
      fail: function () {
        rej('发生错误');
      }
    })
  });
}
function deletePromisenoauth(url) {
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'DELETE',
      success: function (result) {
        var data = result.data;
        var msg = data.msg;
        if (!data.success) {
          rej(msg);
        } else {
          res(msg);
        }
      },
      fail: function () {
        rej('发生错误');
      }
    })
  });
}
function getPromise(url,token){
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        AccountToken: token
      },
      success: function (result) {
        var data = result.data;
        if (!data.success) {
          rej(data.msg);
        } else {
          res(data.result);
        }
      },
      fail: function () {
        rej('发生错误');
      }
    })
  });
}
function getPromisenoauth(url) {
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'GET',
      success: function (result) {
        var data = result.data;
        if (!data.success) {
          rej(data.msg);
        } else {
          res(data.result);
        }
      },
      fail: function () {
        rej('发生错误');
      }
    })
  });
}

function postpromise(url,data,token){
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        AccountToken: token
      },
      success: function (result) {
        var data = result.data;
        var msg=data.msg;
        if (!!data.success) {
          res(data.result||msg);
        } else {
          rej(msg)
        }
      },
      fail: function () {
        rej('发生错误')
      }
    })
  })
}
function postpromisenoauth(url, data) {
  return new Promise((res, rej) => {
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: function (result) {
        var data = result.data;
        var msg = data.msg;
        if (!!data.success) {
          res(data.result || msg);
        } else {
          rej(msg)
        }
      },
      fail: function () {
        rej('发生错误')
      }
    })
  })
}
//等到所有异步函数都执行完触发事件，arr数组都是promise对象
function promiseAll(arr, page) {
  page.setData({
    isLoading: true
  });
  return Promise.all(arr).then((val) => {
    page.setData({
      isLoading: false
    })
    return val;
  });
}
module.exports = {
  Get: Get,
  Post: Post,
  PromiseAll: promiseAll,
  Delete: Delete
}