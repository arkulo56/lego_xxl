// pages/background/scratch_note_list/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_index: 0,
    course_level_list: [],
    note_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var p = that._getCourseLevel();
    p.then(function(){
      that._getCourseNoteList()
    })
  },

  /**
   * 获取课程等级数据 
   */
  _getCourseLevel:function(){
    var that = this;
    return new Promise(function(resolve,reject){
      db.collection("scratch_course_level").get().then(res=>{
        console.log(res)
        that.setData({
          course_level_list:res.data
        })
        resolve("ok")
      })
    })
  },
  /**
   * 获取note列表数据
   */
  _getCourseNoteList:function(){
    var that = this;
    return new Promise(function(resolve,reject){
      db.collection("scratch_course_note")
        .where({
          course_level:that.data.course_level_list[that.data.t_index]._id,
        })
        .orderBy("addtime","desc")
        .get().then(res=>{
        console.log(res)
        that.setData({
          note_list:res.data
        })
        resolve("ok")
      })
    })
  },
  /**
   * picker的change事件
   */
  pickerChange:function(e){
    var that=this;
    that.setData({
      t_index: e.detail.value
    });
    that._getCourseNoteList();
  },
  /**
   * 查看事件
   */
  viewDetail:function(event){
    var that = this;
    console.log(event)
    wx.navigateTo({
      url: '../../scratch_note_detail/index?_id='+event.currentTarget.dataset.id,
    })
  },
  /**
   * 添加事件
   */
  jumpDetail:function(){
    wx.navigateTo({
      url: '../scratch_note_add/index',
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