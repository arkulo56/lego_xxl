// pages/scratch_note_detail/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:"",
    detail:"",
    course_level:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    if (!options._id) {
      console.log("没有拿到主键入參")
      
      wx.navigateTo({
        url: '../index/index'
      })
      
    }else{
      //获取文章主键
      that.setData({
        note_id: options._id
      })
    };
    

    //获取当前课程detail
    var p = that._getCourseDetail()
    //获取当前课程的课程包
    p.then(function(){
      that._getCourseLevel()
    });
  },
  /**
   * 获取课程笔记详情
   */
  _getCourseDetail:function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      db.collection("scratch_course_note").where({
        _id: that.data.note_id
      }).get().then(res => {
        that.setData({
          detail: res.data[0]
        })
        resolve("ok");
      })
    })
  },
  /**
   * 获取当前课程的课程包
   */
  _getCourseLevel:function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      db.collection("scratch_course_level").where({
        _id: that.data.detail.course_level
      }).get().then(res => {
        that.setData({
          course_level: res.data[0].name
        })
        resolve("ok");
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