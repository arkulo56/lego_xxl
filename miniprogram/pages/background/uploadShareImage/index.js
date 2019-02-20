// pages/background/uploadShareImage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rdp:"",
    note_id:"",
    note_title:"",
    qrcode_img:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/上传分享图片按钮素材.jpg",
    qrcode_img_path:"",         //二维码的本地地址
    local_tmp_image:"",         //保存本地时采用的临时变量

    laocal_choose_path:"",      //相册选择后的图片临时文件地址
    choose_img_width:1500,
    choose_img_height:1000,
    laocal_caijian_path:"",     //裁剪后的图片
    tmp_sign:0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //屏幕物理像素
    wx.getSystemInfo({
      success: function (res) {
        var perRpx = res.windowWidth/750
        console.log(perRpx)
        that.setData({
          rdp: perRpx
        })
      },
    })

    if (options.id && decodeURIComponent(options.title))
    {
      that.setData({
        note_id:options.id,
        note_title: decodeURIComponent(options.title)
      })

      //获取小程序
      var r_q = that._getQrCode()
    }


  },
  /**
   * 获取笔记页面分享二维码
   */
  _getQrCode: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: "getQRcode",
        data: {
          moduleKey: "note_detail",
          params: that.data.note_id,
          page: "pages/note/detail",
          id: that.data.note_id
        },
        success: res => {
          console.log(res)
          that.setData({
            qrcode_img: res.result
          })
          //保存云端小程序二维码至本地
          var p = that.getImageToLocal1(that.data.qrcode_img)
          p.then(function () {
            that.setData({
              qrcode_img_path: that.data.local_tmp_image
            })
            resolve("ok")
          })
        },
        fail: error => {
          console.log(error)
        }

      })
    })
  },

  /**
   * 获取网络图片到本地临时地址
   * 
   */
  getImageToLocal1: function (file_path) {
    var that = this
    //console.log("分享图片地址：", file_path)
    return new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: file_path,
        success(res) {
          that.setData({
            local_tmp_image: res.path
          })
          resolve("ok")
        }
      })
    })
  },


  /**
   * 上传分享图片，需要完成以下几步
   * 1. 上传图片
   * 2. 裁剪图片
   * 3. 拼接图片
   * 4. 填充二维码
   * 5. 上传存储服务器
   * 6. 保存图片分享数据库
   */
  choose_share_img:function(){
    var that = this
    wx.chooseImage({
      sizeType: ['original'],
      sourceType: ['album'],
      success: function(res) {
        //console.log(res)
        //获取图片信息
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res){
            console.log(res)
            that.setData({
              choose_img_height:(res.height),
              choose_img_width:(res.width)
            })
            //这里开始调用剪裁图片
            var c1 = that._cutImage()
            // c1.then(function(){
            //   var c2 = that._cutImage1()
            // })
          }
        })
        that.setData({
          laocal_choose_path:res.tempFilePaths[0]
        })

        

      },
    })
  },
  //裁剪图片_1：把图片加载到canvas中
  _cutImage:function(){
    var that = this
    return new Promise(function(resolve,reject){
      console.log((that.data.choose_img_height * that.data.rdp))
      const ctx = wx.createCanvasContext('share_img')
      /**
       * 这里填充原始分享图到canvas中
       * 1. drawImage函数的长款单位都是虚拟像素单位，而我们提供的图片使用的是物理像素
       * 2. 我们导出的图片是750px（物理像素）宽的，长度不定
       * 3. 虚拟像素和物理像素的比值：屏幕宽度（虚拟像素）/750 = 0.5 （也就是一个rpx占多少个虚拟像素，rpx和物理像素差不多）
       * 4. 宽：虚拟像素全屏
       * 5. 高：（图片物理像素）* 0.5 = 虚拟像素（在这块屏幕比下对应的虚拟像素）
       */
      ctx.drawImage(that.data.laocal_choose_path, 0, 0, wx.getSystemInfoSync().windowWidth, (that.data.choose_img_height * that.data.rdp))
      ctx.draw(true,function(){
        resolve()
      })
    })
  },
  //裁剪图片_2:真正开始裁剪
  _cutImage1:function(){
    var that = this
    return new Promise(function(resolve,reject){
      wx.canvasToTempFilePath({
        canvasId: 'share_img',
        x: 0,
        y: 0,
        width: 375,
        height: 3000,
        destWidth: 375,
        destHeight: 3000,
        success(res) {
          console.log(res)
          that.setData({
            laocal_caijian_path: res.tempFilePath,
            tmp_sign: 1
          })
          resolve()
        },
        fail(error) {
          console.log(error)
        },
        complete() {
          console.log("ok le ")
        }
      }, this)
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