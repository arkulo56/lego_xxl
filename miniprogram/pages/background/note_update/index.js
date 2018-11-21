const db = wx.cloud.database()
import Toast from '../../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:"",
    detail:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast('我是提示文案，建议不超过十五字~');

    var that = this
    //接收参数
    that.setData({
      note_id:options._id
    })

    //获取数据
    var p = that._getDetail()
    p.then(function(){
      that._getRelation()
    })
  },

  //读取数据
  _getDetail:function(){
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("course_note").where({
        _id:that.data.note_id
      }).get().then(res=>{
        that.setData({
          detail:res.data[0]
        })
        resolve("ok")
      })

    })
  },

  //读取其他字段
  _getRelation: function () {
    var that = this
    return new Promise(function (resolve, reject) {
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

//表单提交
  formSubmit:function(e)
  {
    var that = this
    console.log(e.detail.value)
    db.collection("course_note").doc(that.data.note_id).update({
      data:{
        note_title:e.detail.value.note_title,
        cover_img:e.detail.value.cover_img,
        note_content:e.detail.value.note_content
      }
    }).then(res=>{
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