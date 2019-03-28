// pages/shop/shop.js
const app = getApp();
import httpUrl from '../../utils/http_util.js';
const appdata = app.globalData;
const isMock = appdata.isMock;
const domainName = appdata.domainName;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrapheight:0,//分类高度
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wrapheight = wx.getSystemInfoSync().windowHeight-60;
    this.setData({
      wrapheight
    });
    this.getDirectory();
  },
  getDirectory:function(){
    httpUrl.Get(domainName +'api/getDirectory',true,this,app,false,isMock).then(res=>{
      //console.log(res);
      this.setData({
        list:res.list
      })
    }).catch(err=>{
      app.errorHandle(err, app, this, this.getDirectory);
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})