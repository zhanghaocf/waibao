//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //异步出错运行的函数统一放在这里
  errorHandle: function (reason,ths, callback) {
    reason = !!reason?reason:"页面出错";
    //以下方法处理服务器重启token值没有了的情况，而在不刷新小程序情况下会出错，因为有本地没有过期的token
    var restart = !!(reason === '401.1 api session expiration');
    if (restart && !!callback) {
      this.getCode().then((res) => {
        return this.getAccessToken(res);
      }).then((res) => {
        callback();
      });
      return;
    }
    wx.showToast({
      title: reason,
      icon: 'none',
    })
    if (!ths) {
      return;
    }
    ths.setData({
      isLoading: false
    })
  },
  globalData: {
    userInfo: null
  }
})