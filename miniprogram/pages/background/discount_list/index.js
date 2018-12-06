const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var p = that._getListData()
    p.then(function(){
      console.log(that.data.list)
    })
  },

  //读取列表数据
  _getListData:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("discount")
      .orderBy("addtime","desc")
      .get().then(res=>{
        that.setData({
          list:res.data
        })
        resolve("ok")
      })
    })
  },

  //修改跳转
  editDiscount:function(event){
    wx.navigateTo({
      url: '../discount_add/index?_id=' + event.currentTarget.dataset.id,
    })
  },
  //预览跳转
  previewDiscount:function(event){
    wx.navigateTo({
      url: '../discount_detail/index?_id=' + event.currentTarget.dataset.id,
    })    
  },
  //下线事件
  downLine:function(event){
    var that = this
    db.collection("discount").doc(event.currentTarget.dataset.id).update({
      data: {
        status: 0
      }
    }).then(res => {
      that.setData({
        list: []
      })
      that._getListData()
    })
  },

  //上线事件
  upLine:function(event){
    var that = this
    db.collection("discount").doc(event.currentTarget.dataset.id).update({
      data:{
        status:1
      }
    }).then(res=>{
      that.setData({
        list:[]
      })
      that._getListData()
    })
  },

  //添加跳转
  addJump:function(){
    wx.navigateTo({
      url: '../discount_add/index',
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
    var that = this
    that.setData({
      list: []
    })
    that._getListData()
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