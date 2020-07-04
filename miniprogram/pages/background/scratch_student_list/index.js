// pages/background/scratch_student_list/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scratch_class: [],
    t_index:0,    //筛选条件时index
    s_index:0,      //设置某个学生班级时的index
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //默认的显示未分班的学生，这个默认的就是0，而不是未分类记录的_id
    that._getScratchStudentList(0);
    //获取班级
    var p = that._getScratchClass();
    p.then(function(){
      console.log(that.data.scratch_class);
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 获取班级
   */
  _getScratchClass:function(){
    var that = this
    return new Promise(function (resolve, reject) {
      db.collection("scratch_class").orderBy("_id","desc").get().then(res => {
        console.log(res.data)
        that.setData({
          scratch_class: res.data
        })
        resolve("ok")
      })
    })
  },

  /**
   * 筛选条件
   */
  bindPickerChange:function(e){
    var that = this;
    that.setData({
      t_index: e.detail.value
    })
    //取班级表中的_id主键
    if(e.detail.value!=0)
    {
      that._getScratchStudentList(that.data.scratch_class[e.detail.value]._id);
    }else
    {
      that._getScratchStudentList(0);
    }
    
  },

  /**
   * 获取学生列表
   */
  _getScratchStudentList:function(e){
    var studentClass="0";
    if(e!="0")
    {
      studentClass = e;
    }
    console.log(studentClass);
    var that = this
    return new Promise(function (resolve, reject) {
      db.collection("scratch_student")
        .where({
          student_class: studentClass
        })
        .orderBy("_id","desc")
        .get().then(res => {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        resolve("ok")
      })
    })
  },

  /**
   * 设置某个学生的班级
   */
  bindSetClass:function(event){
    var that = this;
    that.setData({
      s_index: event.detail.value
    })
    var student_id = event.currentTarget.dataset.id;//学生编号
    var student_index = event.currentTarget.dataset.index;//学生在list中的index
    var class_id = "0";
    if(event.detail.value!=0)
    {
      class_id = that.data.scratch_class[that.data.s_index]._id;
    }

    
    //console.log("设置时班级主键：",class_id);
    return new Promise(function (resolve, reject) {
      db.collection("scratch_student")
        .doc(student_id)
        .update({
          data: {
            student_class: class_id
          }
        })
        .then(res => {
        that.data.list.splice(student_index,1);
        that.setData({
          list: that.data.list
        });
        resolve("ok");
      })
    })
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