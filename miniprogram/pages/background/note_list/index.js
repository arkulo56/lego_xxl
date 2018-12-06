// pages/background/note_list/index.js
import Dialog from '../../../dist/dialog/dialog';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgtmp:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/4.jpg",
    //删选条件
    t_index:0,
    teachers:[],
    list:[],
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
      sc_height: a.windowHeight-50      //界面最上方的教师筛选，高度为50px
    })

    //初始化数据
    that.initData()
  },

  //初始化数据
  initData:function(){
    var that = this
    // that.setData({
    //   teachers: [],
    //   list: []
    // })
    var p = that._getAllTeacher();
    p.then(function () {
      var q = that._getNote()
      q.then(function () {
        that._getNoteRelation()
      })
    })
  },

  //添加笔记按钮跳转
  add_note:function(){
    wx.navigateTo({
      url: '../note/add',
    })
  },

  //选择教师触发事件函数
  bindPickerChange: function (e) {
    var that = this
    this.setData({
      t_index: e.detail.value,
      "loadMore.currentPage":0,
      "loadMore.hasMore":true
    })
    var q = this._getNote()
    q.then(function(){
      that._getNoteRelation()
    })
  },

  //查询所有教师数据
  _getAllTeacher: function (){
    var that = this
    return new Promise(function(resolve,reject){
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

  //笔记查询函数
  _getNote:function(){
    var that = this
    return new Promise(function (resolve, reject) {

    //偏移量
    var offset = (that.data.loadMore.currentPage == 0) ? 0 : (that.data.loadMore.currentPage * that.data.loadMore.pageNum)
    db.collection("course_note")
      .where({
        teacher_id: that.data.teachers[that.data.t_index]._id
      })
      .limit(that.data.loadMore.pageNum)
      .orderBy("addtime", "asc")
      .skip(offset)
      .get().then(res => {
        console.log("查询条件:老师主键", that.data.teachers[that.data.t_index]._id, "／偏移量", offset, "/取数量", that.data.loadMore.pageNum)
        console.log("查询到的笔记数据：",res.data)
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
    //console.log("页码：", that.data.loadMore.currentPage)
    if(that.data.loadMore.currentPage>1)
    {
      //console.log("进来了：", that.data.loadMore.currentPage * that.data.loadMore.pageNum)
      i = (that.data.loadMore.currentPage-1) * that.data.loadMore.pageNum
    }
    for (; i < that.data.list.length; i++) {
      !function (j) {//注意这里，是为了防止循环中的异步
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
          _id:that.data.list[j].course_id
        }).get().then(res=>{
          //console.log(res.data)
          var xiabiao = "list[" + j + "].course_name"
          that.setData({
            [xiabiao]:res.data[0].title
          })
        })
        //查询教师名称
        db.collection("teacher").where({
          _id:that.data.list[j].teacher_id
        }).get().then(res=>{
          var xiabiao = "list[" + j + "].teacher_name"
          that.setData({
            [xiabiao]: res.data[0].name
          })
        })


      }(i)//这里结束部分       
    }
  },


  //预览跳转
  preViewOnclick:function(event){
    wx.navigateTo({
      url: '../note_detail/index?_id='+event.currentTarget.dataset.id,
    })
  },

  //删除跳转
   deleteOnclick: function (event) {
    
    Dialog.confirm({
      title: '删除操作',
      message: '请核实该课程讲师及学员姓名，如果一旦删除，无法找回！'
    }).then(() => {
      wx.navigateTo({
        url: '../note_delete/index?_id=' + event.currentTarget.dataset.id,
      })
    }).catch(() => {
      
    });
  },  

  //修改跳转
  updateOnclick: function (event) {
    wx.navigateTo({
      url: '../note_update/index?_id=' + event.currentTarget.dataset.id,
    })
  },

  //发布按钮
  publishNote: function (event){
    var that = this
    var index = event.currentTarget.dataset.index
    var id = event.currentTarget.dataset.id

    db.collection("course_note").doc(id).update({
      data:{
        status:1
      }
    }).then(res=>{
      var s = "list["+index+"].status"
      //这里就算是更新页面了
      that.setData({
        [s]:1
      })
      console.log("发布成功")
    })

  },

  //下线笔记
  downNote:function(event){
    var that = this
    var index = event.currentTarget.dataset.index
    var id = event.currentTarget.dataset.id
    db.collection("course_note").doc(id).update({
      data: {
        status: 0
      }
    }).then(res => {
      var s = "list[" + index + "].status"
      //这里就算是更新页面了
      that.setData({
        [s]: 0
      })
      console.log("下线成功")
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
    //this.initData()
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
    //this.initData()
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