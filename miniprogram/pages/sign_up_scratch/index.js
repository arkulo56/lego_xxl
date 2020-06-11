// pages/sign_up_scratch/index.js
import Dialog from '../../dist/dialog/dialog';
const db = wx.cloud.database()
//var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  /**
   * 表单提交
   *  
   */
  formSubmit:function(e)
  {
    //console.log("结果：",e.detail.value);
    if(e.detail.value.student_name.length==0
      || e.detail.value.student_age.length==0
      || e.detail.value.student_phone.length==0
      || e.detail.value.student_city.length==0
      || e.detail.value.student_area.length==0
      || e.detail.value.student_codetime.length==0)
    {
      Dialog.alert({
        message: '请完整填写所有选项！',
      }).then(() => {
        // on close
      });
      return;
    }

    if(parseInt(e.detail.value.student_age)>20 || parseInt(e.detail.value.student_age)<5)
    {
      Dialog.alert({
        message: '抱歉哦，您的年龄不适合学习少儿编程！',
      }).then(() => {
        // on close
      });
      return;     
    }

    if(e.detail.value.student_phone.length!=11 || e.detail.value.student_phone.substring(0,1)!='1')
    {
      Dialog.alert({
        message: '手机号错误！',
      }).then(() => {
        // on close
      });
      return;     
    }    

    const note = db.collection("sign_up_scratch");
    note.add(
      {
        data:{
          "student_name":e.detail.value.student_name,
          "student_age":e.detail.value.student_age,
          "student_phone":e.detail.value.student_phone,
          "student_city":e.detail.value.studnet_city,
          "student_area":e.detail.value.student_area,
          "student_id":e.detail.value.student_codetime,
          "addtime": db.serverDate()//util.formatTime(new Date(),2)
        }
      }
    ).then(res=>{
      //console.log(res)

      Dialog.alert({
        title: '成功',
        message: '恭喜您，信息已经录入成功，我们会尽快安排孩子的课程！课程学习过程中，有很多的学习资料和笔记都将在该小程序中展示，因此希望您收藏该小程序，谢谢！',
      }).then(() => {
        // on close
        wx.switchTab({
          url: '/pages/index/index'
        })
      });


    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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