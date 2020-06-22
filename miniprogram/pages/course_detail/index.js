// pages/course_detail/index.js
/**
 * scratch课程详情页面
 * 注意：课程因为不经常修改，因此不做后台页面，直接在云数据库中手动添加！！
 * 课程页面涉及的字段：title、cover_photo、content，其中content可以用markdown语法格式
 */
const db = wx.cloud.database()
var util = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id:0,
    detail:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      course_id:options.course_id
    })
    that._getCourseData()
  },

  //获取课程信息
  _getCourseData:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("sc_course").doc(that.data.course_id).get().then(res=>{
        console.log(res)
        //res.data.addtime = util.formatTime(new Date(res.data.addtime),2)
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