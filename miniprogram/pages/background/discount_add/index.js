const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //如果是修改，可以接收到主键的参数
    if (typeof (options._id) != "undefined") {
      that.setData({
        discount_id:options._id
      })
    }
  },
  //表单提交事件
  formSubmit: function (e) {
    var that = this
    //判断有没有主键，如果有主见，那就是修改，如果没有主键，那就是添加
    if(that.data.discount_id==0)
    {
      that._add(e.detail.value)
    }else
    {
      that._update(e.detail.value)
    }
  },

  //添加数据
  _add:function(e){
    db.collection("discount").add({
      data:{
        title:e.title,
        cover_photo:e.cover_photo,
        content:e.content,
        order_number: parseInt(e.order_number),
        addtime:db.serverDate()
      }
    }).then(res=>{
      console.log("添加成功")
    })
  },
  //修改成功
  _update:function(e){
    var that = this
    db.collection("discount").doc(that.data.discount_id).update({
      data: {
        title: e.title,
        cover_photo: e.cover_photo,
        content: e.content,
        order_number: parseInt(e.order_number),
        addtime: db.serverDate()
      }
    }).then(res => {
      console.log("修改成功")
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