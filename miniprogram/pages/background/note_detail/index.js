const db = wx.cloud.database()
const app = getApp()
var getOI = require("../../../utils/getOpenid.js")
var util = require('../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail:"",
    note_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log("哈哈：",options)
    if(!options._id)
    {
      console.log("没有拿到主键入參") 
    }
    //获取文章主键
    that.setData({
      note_id: options._id
    })    

    //读取笔记数据
    var p = that._getNote()
    p.then(function(){
      that._getRelation()
    })

    //判断一下这个用户是否已经来过了
    //console.log("人言：", app.globalData.openid)
    if (typeof(app.globalData.openid) =="undefined")
    {
      //console.log("没有查到该数据")
      var p =  getOI.getOpenid()
      p.then(function(){
        //console.log(app.globalData)
        that._visiter()
      })
    }else
    {
      that._visiter()
    }

  },

  //读取笔记数据
  _getNote:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("course_note").where({
        _id: that.data.note_id
      }).get().then(res => {
        that.setData({
          detail: res.data[0]
        })
        resolve("ok")
      })
    })
  },
  //读取其他字段
  _getRelation:function(){
    var that = this
    return new Promise(function(resolve,reject){
      //查询学生姓名
      db.collection("student").where({
        _id: that.data.detail.student_id
      }).get().then(res => {
        var xiabiao = "detail.student_name"
        that.setData({
          [xiabiao]: res.data[0].name
        })
      })
      //查询课程标题
      db.collection("course").where({
        _id: that.data.detail.course_id
      }).get().then(res => {
        //console.log(res.data)
        var xiabiao = "detail.course_name"
        that.setData({
          [xiabiao]: res.data[0].title
        })
      })
      //查询教师名称
      db.collection("teacher").where({
        _id: that.data.detail.teacher_id
      }).get().then(res => {
        var xiabiao = "detail.teacher_name"
        that.setData({
          [xiabiao]: res.data[0].name
        })
      })
    })
  },

  /**
   * 对访客进行记录
   * 1. 先查询访客是否已经访问过
   * 2. 如果没有访问过，则插入访问记录
   */
  _visiter:function(){
    var that = this
    db.collection("note_visiter").where({
      openid: app.globalData.openid,
      note_id:that.data.note_id
    }).get().then(res=>{
      console.log("查询房客：",res.data)
      if(res.data.length==0)
      {
        db.collection("note_visiter").add({
          data:{
            note_id:that.data.note_id,
            openid: app.globalData.openid,
            visit_time: util.formatTime(new Date(), 3)
          }
        }).then(res=>{
          console.log("访客记录添加成功")
        })
      }
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