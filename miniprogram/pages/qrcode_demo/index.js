// pages/qrcode_demo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

      var a = that.drawContent()
      a.then(function(){
        var b = that.toTmpFile()
        b.then(function(){
          console.log("临时图片生成")
          var c = that.saveImageToLocal()
        })
      })

  },

  //画图
  drawContent: function () {
    console.log("jinlaile")
    var that = this
    return new Promise(function (resolve, reject) {

      const ctx = wx.createCanvasContext('shareCanvas')

      //设置课程主副标题
      ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#193559')  // 文字颜色：黑色
      ctx.setFontSize(22)         // 文字字号：22px
      ctx.fillText("<view>想象力&机器人专业课</view>", 100, 100)
      ctx.stroke()
      ctx.draw(true, function () {
        console.log("制图")
        resolve("ok")
      })

    })
  },

  //绘图工具在本地生成临时图片
  toTmpFile: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.canvasToTempFilePath({
        x:0,
        y:0,
        width:750,
        height:700,
        canvasId: 'shareCanvas',
        success(res) {
          //console.log("临时图片路径：",res.tempFilePath)
          that.setData({
            filepath: res.tempFilePath
          })
          resolve("ok")
        },
        fail(e) {
          console.log(e)
        }
      }, this)

    })
  },




  /**
   * 保存分享图片至用户手机相册
   */
  saveImageToLocal: function () {
    console.log("进入保存图片函数")
    var that = this
    return new Promise(function (resolve, reject) {

      wx.saveImageToPhotosAlbum({
        filePath: that.data.filepath,
        success(res) {
          console.log("保存成功")
        },
        fail(error){
          console.log(error)
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