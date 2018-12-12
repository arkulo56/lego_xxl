/**
 * 笔记详情页生成分享图片
 * 1. 详情页需要传递主键等信息
 * 2. 需要查询出笔记名称，课程名称，课程模型
 * 3. 获取笔记页面的小程序码
 */

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:"",
    wait_height:50,
    wait_icon_type:"waiting",
    wait_content:"请稍后，正在生成分享图片...",
    c_width:0,          //窗口屏幕宽度
    c_height:0,         //窗口屏幕高度
    imgTim:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/share_background_2.jpg",  //背景图片
    cover_img:"",  //封面图片
    backImagePath:"",     //背景图片本地地址
    cover_img_path:"",    //封面图片本地地址
    tmpPath:"",           //保存临时图片的路径
    cover_width:250,      //封面图片宽度
    cover_height:250,      //封面图片高度
    cover_rpx:0,           //封面图片适应屏幕比
    note_detail:"",         //笔记数据
    qrcode_img:"",         //小程序码cloud地址
    qrcode_img_path:""      //小程序码本地地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log(options)
    that.setData({
      note_id:options.id
    })
    // that.setData({
    //   note_id: "W-VLCHhEiJmgcxJQ"
    // })

    // //获取当前手机窗口大小
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          c_width:res.windowWidth,
          c_height:res.windowHeight,
          cover_rpx:res.windowHeight/603
        })
        //console.log(res)
      },
    })

    //获取笔记详情页的小程序码
    var Qr_res = that._getQrCode()
    Qr_res.then(function(){
      //获取笔记相关数据
      var data_res = that._getNoteData(that.data.note_id)
      data_res.then(function(){
        //console.log(that.data.cover_img)
        //生成图片过程
        var a = that.getImageToLocal(0)
        a.then(function(){//网络图片取回来
          var a1 = that.getImageToLocal(1)
          a1.then(function(){
            var b = that.drawContent()
            b.then(function () {//绘图成功
              var p = that.toTmpFile()
              p.then(function () {//临时图片生成成功
                that.saveImageToLocal()
              })
            })
          })
        })
      })
    })



  },

  //获取相关信息
  _getNoteData:function(note_id){
    var that = this
    return new Promise(function(resolve,reject){
      //先查询笔记信息
      db.collection("course_note").where({
        _id:note_id
      }).get().then(res=>{
        //console.log(res)
        //获取课程信息
        db.collection("course").where({
          _id:res.data[0].course_id
        }).get().then(res_course=>{
          console.log(res)
          var d = res.data[0]
          d.course_title = res_course.data[0].title
          that.setData({
            cover_img:res_course.data[0].mode_img,
            note_detail:d
          })
          resolve("ok")
        })
      })
    })
  },

  //获取页面小程序码
  _getQrCode:function(){
    var that = this
    return new Promise(function(resolve,reject){
      wx.cloud.callFunction({
        name: "getQRcode",
        data: {
          moduleKey: "note_detail",
          params: that.data.note_id,
          page:"pages/note/detail",
          id:that.data.note_id
        },
        success: res => {
          //console.log(res)
          that.setData({
            qrcode_img:res.result
          })
          var p = that.getImageToLocal(2)
          p.then(function(){
            resolve("ok")
          })
        },
        fail: error => {
          console.log(error)
        }

      })
    })
  },


  //获取网络图片到本地
  getImageToLocal:function(type){
    var that = this
    return new Promise(function(resolve,reject){
      var file_path = ""
      switch (type) {
        case 0:
          file_path = that.data.imgTim
          break;
        case 1:
          file_path = that.data.cover_img
          break;
        case 2:
          file_path = that.data.qrcode_img
          break;
      }
      wx.getImageInfo({
        src: file_path,
        success(res){
          switch(type)
          {
            case 0:
              that.setData({
                backImagePath: res.path
              })
            break;
            case 1:
              that.setData({
                cover_img_path: res.path
              })   
            break;
            case 2:
              that.setData({
                qrcode_img_path:res.path
              })
            break;
          }
          resolve("ok")
        }
      })
    })
  },


  //画图
  drawContent:function(){
    var that = this
    return new Promise(function(resolve,reject){

      const ctx = wx.createCanvasContext('shareCanvas')
      //背景图片
      ctx.drawImage(that.data.backImagePath, 0, 0, that.data.c_width, that.data.c_height)

      //课程封面图片，图片缩放为0.8，自动计算图片的x位置
      var left_padding = (that.data.c_width - (that.data.cover_width))/2
      var top_padding = (that.data.c_height*0.55)-(that.data.cover_height/2)
      ctx.drawImage(that.data.cover_img_path, left_padding, top_padding, (that.data.cover_width), (that.data.cover_height))

      //设置二维码图片
      ctx.drawImage(that.data.qrcode_img_path,that.data.c_width*0.67,that.data.c_height*0.79,90,90)


      //设置课程主副标题
      ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#193559')  // 文字颜色：黑色
      ctx.setFontSize(22)         // 文字字号：22px
      ctx.fillText("想象力&机器人专业课", (that.data.c_width / 2), (that.data.c_height*0.19))

      ctx.setFillStyle('#e18d39')  // 文字颜色：黑色
      ctx.setFontSize(30)         // 文字字号：22px
      ctx.fillText(that.data.note_detail.course_title, (that.data.c_width / 2), (that.data.c_height * 0.26))
      ctx.stroke()
      //把waiting图片给去掉
      that.setData({
        wait_height: 0,
        wait_icon_type: "",
        wait_content: "",
      })

      ctx.draw(true,function(){
        resolve("ok")
      })

    })
  },


  //生成临时图片
  toTmpFile:function(){
    var that = this
    return new Promise(function(resolve,reject){
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success(res){
          console.log("临时图片路径：",res.tempFilePath)
          that.setData({
            tmpPath: res.tempFilePath
          })
          resolve("ok")
        },
        fail(e){
          console.log(e)
        }
      }, this)
    
    })
  },

  //保存临时文件到本地
  saveImageToLocal:function(){
    var that = this
    return new Promise(function(resolve,reject){
      wx.saveImageToPhotosAlbum({
        filePath: that.data.tmpPath,
        fail(res){
          //console.log("保存失败：",res)
          wx.navigateBack({
            delta: 1
          })
        },
        success(res)
        {
          wx.navigateBack({
            delta:1
          })
        }
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