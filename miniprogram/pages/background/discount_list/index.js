const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tmpImg:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/750-437.jpg",
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var p = that._getListData()
  },

  //读取列表数据
  _getListData:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("discount").get().then(res=>{
        that.setData({
          list:res.data
        })
        resolve("ok")
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