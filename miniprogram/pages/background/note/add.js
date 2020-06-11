// pages/background/note/add.js
const db = wx.cloud.database()
var util = require('../../../utils/util.js')
var course_all,teacher_all,student_all;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherRange: [],
    teacherIndex: 0,
    courseRange:[],
    courseIndex:0,
    studentRange:[],
    studentIndex:0
  },
  //教师选择
  teacherChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      teacherIndex: e.detail.value
    })
  },
  //课程选择
  changeCourse: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseIndex: e.detail.value
    })
  },
  //学生选择
  studentChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      studentIndex: e.detail.value
    })
  },

  //表单提交
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //处理课程、教师、学员的主键，因为picker的value只是range数组的下标
    var course_id = course_all[e.detail.value.course]._id
    var student_id = student_all[e.detail.value.student]._id
    var teacher_id = teacher_all[e.detail.value.teacher]._id
    //console.log(course_id+"   "+student_id+"    "+teacher_id)

    const note = db.collection("course_note")
    note.add(
      {
        data:{
          "cover_img":e.detail.value.cover_img,
          "note_content":e.detail.value.note_content,
          "note_title":e.detail.value.note_title,
          "teacher_id":teacher_id,
          "course_id":course_id,
          "student_id":student_id,
          "status":0,
          "reading_account":0,
          "addtime": db.serverDate()//util.formatTime(new Date(),2)
        }
      }
    ).then(res=>{
      //console.log(res)
      wx.navigateBack({
        delta:1
      })
    })
  
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化课程数据
    db.collection("course").orderBy("_id","asc").get().then(res => {
      //console.log(res.data[0])
      for(var i=0;i<res.data.length;i++)
      { 
        course_all = res.data;
        this.data.courseRange = this.data.courseRange.concat([res.data[i].title])
        this.setData({
          "courseRange":this.data.courseRange
        })
      }
    }).catch(e => {
      //console.log(e)
    }) ;

    //初始化学员数据
    db.collection("student").orderBy("_id","desc").get().then(res=>{
      console.log(res.data)
      for(var j=0;j<res.data.length;j++)
      {
        student_all = res.data;
        this.data.studentRange = this.data.studentRange.concat([res.data[j].name])
        this.setData({
          "studentRange":this.data.studentRange
        })
      }
    })

    //获取教师
    db.collection("teacher").get().then(res => {
      //console.log(res.data)
      for (var j = 0; j < res.data.length; j++) {
        teacher_all = res.data
        this.data.teacherRange = this.data.teacherRange.concat([res.data[j].name])
        this.setData({
          "teacherRange": this.data.teacherRange
        })
      }
    })
    //console.log(this.data.teacherRange)  

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