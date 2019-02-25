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
    share_img_buttom:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/fenxiangtupiandibu.jpg",    //分享图片底部
    share_img_buttom_path:"",   //分享图片本地地址
    local_tmp_image:"",         //保存本地时采用的临时变量

    laocal_choose_path:"",      //相册选择后的图片临时文件地址
    choose_img_width:0,
    choose_img_height:0,
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
        console.log(res.pixelRatio)
        //res.windowsWidth这是屏幕的宽度，值的是虚拟像素
        //下面这个公式，就是计算一个rpx对应多少个虚拟像素
        that.setData({
          rdp: res.pixelRatio
        })
      },
    })

    //判断参数是否完整
    if (options.id && decodeURIComponent(options.title))
    {
      //获取参数
      that.setData({
        note_id:options.id,
        note_title: decodeURIComponent(options.title)
      })

      //获取小程序分享二维码
      var r_q = that._getQrCode()
      //获取分享底部图片到本地
      var buttom_res = that.getImageToLocal1(that.data.share_img_buttom)
      buttom_res.then(function () {
        that.setData({
          share_img_buttom_path: that.data.local_tmp_image
        })
      })

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
   * 
   * 
   * 选择图片
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
            c1.then(function(){
              var c2 = that._cutImage1()
              c2.then(function(){
                that.saveImageToLocal()
              })
            })
          }
        })
        that.setData({
          laocal_choose_path:res.tempFilePaths[0]
        })

        

      },
    })
  },
  //把图片加载到canvas中
  _cutImage:function(){
    var that = this
    return new Promise(function(resolve,reject){
      console.log((that.data.choose_img_height * that.data.rdp))
      const ctx = wx.createCanvasContext('share_img')
      //将简书长图添加至画布中
      ctx.drawImage(that.data.laocal_choose_path, 0, 0, that.data.choose_img_width / that.data.rdp, that.data.choose_img_height / that.data.rdp)

      //将保存二维码的底部加入到画布中,因为画布的高度是定死的2000px，所以这里就直接定义图片的y轴高度
      //160是分享图片底部栏的物理像素高度
      ctx.drawImage(that.data.share_img_buttom_path, 0, (2000 - (160 / that.data.rdp)), that.data.choose_img_width / that.data.rdp, 160 / that.data.rdp)

      //将二维码加入到底部位置
      ctx.drawImage(that.data.qrcode_img_path, 20, (2000 - (160 / that.data.rdp)+5),40,40)




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
        success(res) {
          console.log(res)
          that.setData({
            laocal_caijian_path: res.tempFilePath
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
   * 保存分享图片至用户手机相册
   */
  saveImageToLocal: function () {
    var that = this
    return new Promise(function (resolve, reject) {

      wx.saveImageToPhotosAlbum({
        filePath: that.data.laocal_caijian_path,
        // fail(res) {
        //   console.log("保存失败：", res)
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // },
        // success(res) {
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }
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