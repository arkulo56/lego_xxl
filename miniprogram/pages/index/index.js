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
    list: [],
    pageLimit:5,
    adv_list:[]
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

        //初始化数据
        var p = that._getNote()
        p.then(function () {
            console.log("列表数据：",that.data.list)
            that._getNoteRelation()
        })

      })

    })
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



  //获取笔记列表数据
  _getNote: function () {
    var that = this
    return new Promise(function (resolve, reject) {

      db.collection("course_note").where({
        status:1
      })
        .limit(that.data.pageLimit)
        .orderBy("addtime", "desc")
        .get().then(res => {
          console.log(res.data)
          that.setData({
            list: res.data
          })
          resolve("ok")
        })

    })
  },

  //为笔记查询相关数据：教师姓名，学生姓名，课程标题
  _getNoteRelation: function () {
    var that = this
    var i = 0;

    for (var i=0; i < that.data.list.length; i++) {
      !function (j) {//注意这里，是为了防止循环中的异步

        //这里是将服务器db.serverDate转换为本地的Date对象，然后进行格式化输出
        var addtime = util.formatTime(new Date(that.data.list[j].addtime),2)
        var xiabiao = "list[" + j + "].addtime"
        that.setData({
            [xiabiao]:addtime
        })

        //查询学生姓名
        db.collection("student").where({
          _id: that.data.list[j].student_id
        }).get().then(res => {
          var xiabiao = "list[" + j + "].student_name"
          that.setData({
            [xiabiao]: res.data[0].name
          })
        })
        //查询课程标题
        db.collection("course").where({
          _id: that.data.list[j].course_id
        }).get().then(res => {
          //console.log(res.data)
          var xiabiao = "list[" + j + "].course_name"
          that.setData({
            [xiabiao]: res.data[0].title
          })
        })
        //查询教师名称
        db.collection("teacher").where({
          _id: that.data.list[j].teacher_id
        }).get().then(res => {
          var xiabiao = "list[" + j + "].teacher_name"
          that.setData({
            [xiabiao]: res.data[0].name
          })
        })


      }(i)//这里结束部分       
    }
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


  //后台跳转函数
  background_onclick:function(){
    wx.navigateTo({
      url: "../background/index/index",
    })
  },

  //跳转课程笔记列表页
  jumpNoteList:function(event){
    wx.navigateTo({
      url: '../note_list/index',
    })
  },

  //预览跳转
  jumpDetail: function (event) {
    wx.navigateTo({
      url: '../note/detail?_id=' + event.currentTarget.dataset.id,
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