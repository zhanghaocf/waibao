//app.js
import wxapi from '/utils/wxapiToPromise.js';
import httputil from '/utils/http_util.js';
App({
  onLaunch: function () {
    var that = this;
    //发布新版本时检测用户页面是否需要重启
    that.updateTest();
    // 登录
    that.doLogin();
    // 获取用户信息
    wxapi.proxy.getSetting().then(res=>{
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        that.getUserInfo();
      }else{
        //console.log('未授权')
        if (this.unloginCallback) {
          this.unloginCallback()
        }
      }
    })
  },
  //调用获取用户信息接口
  getUserInfo: function(){
    wxapi.proxy.getUserInfo().then(res=>{
      console.log(res);
      // 可以将 res 发送给后台解码出 unionId
      this.globalData.userInfo = res.userInfo;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
    })
  },
  doLogin: function(){
    return wxapi.proxy.login().then(res => {
      return this.getAccessToken(res.code)
    }).then(res => {
      this.globalData.token= res.accountToken;
      //解决首页有需要用到token的提前在获取token之前就加载了
      if (this.beforeLoginCallback) {
        this.beforeLoginCallback();
      }
    }).catch(err => {
      this.errorHandle(err, that);
    })
  },
  //获取token值
  getAccessToken: function(code){
    let isMock = this.globalData.isMock;
    return httputil.Post(this.globalData.domainName + 'api/account/login',   {
      code:code
    },false,null,this,false,isMock);
  },
  //发布新版本时检测用户页面是否需要重启
  updateTest: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    });
    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '新版本下载失败,请重新获取该小程序',
        icon: 'none'
      })
    })
  },
  //异步出错运行的函数统一放在这里
  errorHandle: function (reason,app,page,callback) {
    reason = !!reason?reason:"页面出错";
    //以下方法处理服务器重启token值没有了的情况，而在不刷新小程序情况下会出错，因为有本地没有过期的token
    var restart = reason === '401.1 api session expiration';
    if (restart && !!callback) {
      app.doLogin().then((res) => {
        callback();
      });
      return;
    }
    wx.showToast({
      title: reason,
      icon: 'none',
    })
    if (!page) {
      return;
    }
    page.setData({
      isLoading: false
    })
  },
  navigatologin: function(){
    !this.globalData.userInfo && wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  globalData: {
    token:null,
    userInfo: null,
    isMock: true,
    domainName:''
  }
})