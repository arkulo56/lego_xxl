const app = getApp()
const db = wx.cloud.database()
var util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    imgUrls: [
      'cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/750-437.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    avatarUrl:"",
    logged:false,
    //后台入口判断
    is_admin:false,
    //列表相关数据变量
    imgtmp: "cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/4.jpg",
    pageLimit:5,
    adv_list:[],
    note_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取广告数据
    var adv = that._getAdvList()
    adv.then(function(){
      //获取用户openID
      var q = that._getOpenId()
      q.then(function(){
      })
    });
    //获取scratch笔记
    that._getCourseNoteList()
  },

  /**
   * 广告数据查询
   */
  _getAdvList:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("discount")
      .field({
        _id:true,
        cover_photo:true
      })
      .where({
        is_show:1,
        status:1
      })
      .orderBy("order_number","desc")
      .get().then(res=>{
        console.log("广告列表：",res.data)
        that.setData({
          adv_list:res.data
        })
        resolve("ok")
      })
    })

  },

  /**
   * 获取课程教案笔记列表数据
   */
  _getCourseNoteList:function(){
    var that = this;
    return new Promise(function(resolve,reject){
      db.collection("scratch_course_note")
        .orderBy("addtime","desc")
        .limit(6)
        .get()
        .then(res=>{
        console.log(res)
        that.setData({
          note_list:res.data
        })
        resolve("ok")
      })
    })
  },







  //获取用户openid
  _getOpenId:function(){
    var that = this
    return new Promise(function(resolve,reject){

      //获取openid
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          //console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          //console.log(app.globalData.openid)
          //读取数据库，判定是否为内部员工
          db.collection("teacher").where({
            openid: res.result.openid
          }).get().then(res1 => {
            //console.log(res1)
            //在缓存中保存内部员工的数据
            wx.setStorage({
              key: 'admin',
              data: res1.data,
            })
            //如果有员工的数据，则打开后台入口
            if (res1.data.length >= 1) {
              that.setData({
                is_admin: true
              })
            }
            resolve("ok")
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })

    })
  },

  //广告跳转
  advJump:function(event){
    console.log(event)
    wx.navigateTo({
      url: "../background/discount_detail/index?_id=" + event.currentTarget.dataset.id,
    })
  },
  
  //课程详情页跳转
  courseJump:function(event)
  {
    wx.navigateTo({
      url: '../course_detail/index?course_id='+event.currentTarget.dataset.id,
    })

  },

  //后台跳转函数
  background_onclick:function(){
    wx.navigateTo({
      url: "../background/index/index",
    })
  },

  //跳转课程中心
  jumpCourseCenter:function(event){
    wx.switchTab({
      url: '../course_center/index',
    })
  },

  //跳转旧版乐高笔记
  stumpOldLego:function(){
    wx.navigateTo({
      url: '../note_list/index',
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
    this.onLoad()
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