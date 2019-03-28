//index.js
//获取应用实例
const app = getApp();
import httpUrl from '../../utils/http_util.js';
import apiproxy from '../../utils/wxapiToPromise.js';
const appdata = app.globalData;
const isMock = appdata.isMock;
const domainName = appdata.domainName;
const token = appdata.token;
Page({
  data: {
    isLoading: false,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    circleSize:120,//circle进度环大小
    bannerList:[],
    classifyList:[],
    achievement:{
      walk:0,
      kilo:0
    },
    recommendList:[]
  },
  onLoad: function () {
    //设置进度换大小
    let circleSize=wx.getSystemInfoSync().windowWidth/750*312;
    this.setData({
      circleSize
    })
    if (!app.globalData.userInfo) {
      if (this.data.canIUse){
          app.unloginCallback = res => {
            app.navigatologin();
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
    }
    //TODO:需要还原到时
    // if(!!token){
      this.getData();
    // }else{
    //   let ths=this;
    //   app.beforeLoginCallback=function(){
    //     ths.getData();
    //   }
    // }
    
  },
  getData:function(){
    let arr = [this.getBannerHttp(), this.getClassify(), this.getAchievement(), this.getRecommend()];
    httpUrl.PromiseAll(arr,this).then(res=>{
      console.log(res);
    }).catch(err=>{
      app.errorHandle(err,app,this,this.getData);
    })
  },
  getRecommend:function(){
    return httpUrl.Get(domainName +'api/getRecommend',false,this,app,false,isMock).then(res=>{
      //console.log(res);
      this.setData({
        recommendList:res.list
      })
      return res;
    })
  },
  getAchievement:function(){
    return httpUrl.Get(domainName +'api/getAchievement',false,this,app,true,isMock).then(res=>{
      //console.log(res);
      this.setData({
        achievement:res
      })
      return res;
    })
  },
  getClassify:function(){
    return httpUrl.Get(domainName+'api/getClassify',false,this,app,false,isMock).then(res=>{
      //console.log(res)
      this.setData({
        classifyList:res.list
      })
      return res;
    })
  },
  getBannerHttp:function(){
    return httpUrl.Get(domainName+'api/getBanner', false, this, app, false, isMock).then(res => {
      //console.log(res)
      this.setData({
        bannerList:res.list
      });
      return res;
    })
  }
})
