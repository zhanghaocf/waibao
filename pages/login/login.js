// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo: function (e) {
    console.log(e);
    let userInfo = e.detail.userInfo;
    if (!!userInfo){
      app.globalData.userInfo = e.detail.userInfo;
      wx.navigateBack({});
    }
  }
})