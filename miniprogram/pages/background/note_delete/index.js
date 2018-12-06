const db = wx.cloud.database()
import Toast from '../../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      note_id:options._id
    })

    //调用删除函数
    that._deleteNote()
  },

  //删除函数
  _deleteNote:function()
  {
    var that = this
    return new Promise(function(resolve,reject){
      db.collection("course_note").doc(that.data.note_id).remove().then(res=>{
        console.log("删除成功")
        Toast.success('删除成功');
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1500)
        
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