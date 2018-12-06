const db = wx.cloud.database()
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tmpImg:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/750-437.jpg",
    discount_id:0,
    detail:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      discount_id:options._id
    })

    var p = that._getDiscountData()
  },

  //获取促销活动信息
  _getDiscountData:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("discount").doc(that.data.discount_id).get().then(res=>{
        // console.log(res)
        res.data.addtime = util.formatTime(new Date(res.data.addtime),2)
        that.setData({
          detail:res.data
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})