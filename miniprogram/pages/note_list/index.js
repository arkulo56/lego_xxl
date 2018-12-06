// pages/background/note_list/index.js
import Dialog from '../../dist/dialog/dialog';
const db = wx.cloud.database();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgtmp: "cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/4.jpg",
    //删选条件
    t_index: 0,
    teachers: [],
    list: [],
    //上拉加载
    loadMore: {
      hasMore: true,
      currentPage: 0,
      pageNum: 6
    },
    sc_height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //设置手机中，scroll-view的实际高度
    var a = wx.getSystemInfoSync()
    that.setData({
      sc_height: a.windowHeight - 50      //界面最上方的教师筛选，高度为50px
    })

    //初始化数据
    var p = that._getAllTeacher();
    p.then(function () {
      var q = that._getNote()
      q.then(function () {
        that._getNoteRelation()
      })
    })
  },


  //选择教师触发事件函数
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      t_index: e.detail.value,
      "loadMore.currentPage": 0,
      "loadMore.hasMore": true
    })
    var q = this._getNote()
    q.then(function () {
      that._getNoteRelation()
    })
  },

  //查询所有教师数据
  _getAllTeacher: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      db.collection("teacher").get().then(res => {
        //console.log(res.data)
        that.setData({
          teachers: res.data
        })
        resolve("ok")
      })
    })
  },

  //绑定上拉加载事件
  bindLoadMore: function () {
    var that = this
    var q = this._getNote()
    q.then(function () {
      that._getNoteRelation()
    })
  },

  //查询所有笔记
  _getNote: function () {
    var that = this
    return new Promise(function (resolve, reject) {

      //偏移量
      var offset = (that.data.loadMore.currentPage == 0) ? 0 : (that.data.loadMore.currentPage * that.data.loadMore.pageNum)
      db.collection("course_note")
        .where({
          teacher_id: that.data.teachers[that.data.t_index]._id,
          status:1
        })
        .limit(that.data.loadMore.pageNum)
        .orderBy("addtime", "desc")
        .skip(offset)
        .get().then(res => {
          console.log(res.data)
          //如果当前页大于0，不是第一页，则数据是追加
          if (that.data.loadMore.currentPage > 0) {
            that.data.list = that.data.list.concat(res.data)
            that.setData({
              list: that.data.list
            })
          } else  //否则数据是直接赋值
          {
            that.setData({
              list: res.data
            })
          }
          //不管什么页面，总是要增加页码的
          that.setData({
            "loadMore.currentPage": that.data.loadMore.currentPage + 1
          })
          //判断是不是最后页面了
          if (res.data.length < that.data.loadMore.pageNum) {
            that.setData({
              "loadMore.hasMore": false
            })
          }
          resolve("ok")
        })

    })
  },

  //为笔记查询相关数据：教师姓名，学生姓名，课程标题
  _getNoteRelation: function () {
    var that = this
    var i = 0;
    if (that.data.loadMore.currentPage > 1) {
      i = (that.data.loadMore.currentPage - 1) * that.data.loadMore.pageNum
    }
    for (; i < that.data.list.length; i++) {
      !function (j) {//注意这里，是为了防止循环中的异步

        //这里是将服务器db.serverDate转换为本地的Date对象，然后进行格式化输出
        var addtime = util.formatTime(new Date(that.data.list[j].addtime), 2)
        var xiabiao = "list[" + j + "].addtime"
        that.setData({
          [xiabiao]: addtime
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

  // //跳转至详情页
  // jumpDetail:function(event){
  //   console.log("dfsdfsd")
  //   wx.navigateTo({
  //     url: '../note/detail?/_id='+event.currentTarget.dataset.id,
  //   })
  // },

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
    //this.onLoad()
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