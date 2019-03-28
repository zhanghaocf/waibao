const app = getApp();
import httpUrl from '../../utils/http_util.js';
import apiproxy from '../../utils/wxapiToPromise.js';
const appdata = app.globalData;
const isMock = appdata.isMock;
const domainName = appdata.domainName;
const address = appdata.address;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,
    addressObjects: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getAddress();
  },
  /**
   * 获取地址列表
   */
  getAddress:function(bol){
    if (!!address){
      console.log('用了缓存');
      this.setData({
        addressObjects: address
      });
      return;
    }
    httpUrl.Get(domainName + '/api/address', true, this, app, true,isMock).then((res) => {
      ths.setData({
        addressObjects: res,
        isLoading: false
      })
    },(reason)=>{
      app.errorHandle(reason,ths,function(){
        ths.getAddress(bol);
      });
      ths.setData({
        addressObjects: [],
      })
    })
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var modifyAddress = wx.getStorageSync("modifyAddress");
    if (!!modifyAddress){
      //跳回商品购买页
      return;
    }
    wx.switchTab({
      url: "/pages/personal/personal"
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  setDefault:function(event){
    var index=parseInt(event.currentTarget.dataset.index);
    var id=event.currentTarget.dataset.id;
    var list = this.data.addressObjects;
    var ths=this;
    if (!!list[index].isDefult){
        return;
    }
    wx.showModal({
      title: '提示',
      content: '小主是否将该地址作为默认地址呢',
      success: function (res) {
        if (res.confirm) {
          ths.setDefaultAddress(id).then((res)=>{
            var res=!!res?res:"设置成功"
            wx.showToast({
              title: res,
            })
            for (var i = 0; i < list.length; i++) {
              list[i].isDefult = false;
            }
            list[index].isDefult = true;
            ths.setData({
              addressObjects: list,
              isLoading:false
            });
          },(reason)=>{
            app.errorHandle(reason,ths,function(){
              ths.setDefault(event);
            });
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  /**
   * 设置默认地址
   */
  setDefaultAddress:function(id){
    var ths=this;
    var domainName=app.globalData.domainName;
    return httpUrl.Post(domainName +"/api/address/default",id,true,ths,app,true);
  },
  delete:function(event){
    var index = parseInt(event.currentTarget.dataset.index);
    var id = event.currentTarget.dataset.id;
    var ths=this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          ths.deleteAddress(id,index);
        }
      }
    })
  },
  deleteAddress:function(id,index){
    var ths=this;
    var domainName=app.globalData.domainName;
    var list = this.data.addressObjects;
    httpUrl.Delete(domainName+'/api/address/'+id,true,ths,app,true).then((res)=>{
      list.splice(index, 1);
      ths.setData({
        addressObjects: list,
        isLoading:false
      });
      wx.showToast({
        title: res,
      })
    },(reason)=>{
      app.errorHandle(reason,ths,function(){
        ths.deleteAddress(id, index);
      });
    })
  },
  gotoNewEdit:function(event){
    var id=event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?id='+id
    })
  },
  selAddress:function(event){
    var modifyAddress = wx.getStorageSync("modifyAddress");
    if (!modifyAddress){
      return;
    }
    var address=event.currentTarget.dataset.address;
    // var detailAddress = address.province + address.city + address.district + address.fullAddress
    // var obj={
    //   address: detailAddress,
    //   contact:address.name,
    //   phone:address.phone
    // }
    modifyAddress.address = address;
    wx.setStorageSync("modifyAddress", modifyAddress);
    wx.navigateBack({})
  }
})