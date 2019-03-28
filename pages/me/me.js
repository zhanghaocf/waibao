// pages/me/me.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const appuserInfo = app.globalData.userInfo;
    const userInfo = this.data.userInfo;
    console.log(userInfo)
    if (!appuserInfo){
      //没有用户信息
      app.navigatologin();
    }else{
      //有用户信息
      (!userInfo) && this.setData({
        userInfo: appuserInfo
      })
    }
  }
})