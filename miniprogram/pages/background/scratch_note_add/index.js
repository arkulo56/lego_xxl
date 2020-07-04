// pages/background/scratch_note_add/index.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_index:0,
    level_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that._getCourseLevel();
  },

  /**
   * 获取课程包等级数据，供给页面选择使用
   */
  _getCourseLevel:function(){
    var that = this;
    db.collection("scratch_course_level").get().then(res=>{
      that.setData({
        level_list:res.data
      })
    })
  },

  /**
   * 课程包选择改变值事件 
   */
  pickChange:function(e)
  {
    var that = this;
    that.setData({
      t_index: e.detail.value
    })
  },

  /**
   * 表单提交数据
   */
  formSubmit:function(e){
    //console.log(e.detail.value);
    var that = this
    db.collection("scratch_course_note").add({
      data:{
        course_name: e.detail.value.course_name,
        course_level: that.data.level_list[that.data.t_index]._id,
        course_cover: e.detail.value.course_cover,
        course_content: e.detail.value.course_content,
        addtime: db.serverDate()
      }
    }).then(res=>{
      console.log("添加成功")
      wx.navigateBack({
        delta:1
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