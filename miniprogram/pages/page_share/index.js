/**
 * 笔记详情页生成分享图片
 * 1. 详情页需要传递主键等信息
 * 2. 需要查询出笔记名称，课程名称，课程模型
 * 3. 获取笔记页面的小程序码
 * 
 * 函数列表：
 * 1. _postShareImageToCloud：上传分享图片至云存储，并写数据库
 * 2. _getNoteData:获取笔记信息
 * 3. _getQrCode：获取小程序二维码
 * 4. getImageToLocal1：获取网络图片到本地临时文件
 * 5. drawContent：画图
 * 6. toTmpFile：绘图工具在本地生成临时图片
 * 7. saveImageToLocal：保存分享图片至用户相册
 * 8. getShareImageInfo：获取图票分享表的相关记录
 */

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id:"",         //笔记主键
    isDownFile:0,       //这里是指是否需要下载分享图片，如果是后台添加的时候，是不需要分享的，前台详情页有可能需要
    wait_height:50,
    wait_icon_type:"waiting",
    wait_content:"请稍后，正在生成分享图片...",
    c_width:0,          //窗口屏幕宽度
    c_height:0,         //窗口屏幕高度
    imgTim:"cloud://logo-xxl-3e7925.6c6f-logo-xxl-3e7925/ad_img/share_background_2.jpg",  //背景图片
    cover_img:"",         //封面图片
    backImagePath:"",     //背景图片本地地址
    cover_img_path:"",    //封面图片本地地址
    tmpPath:"",           //保存临时图片的路径
    cover_width:250,      //封面图片宽度
    cover_height:250,      //封面图片高度
    cover_rpx:0,           //封面图片适应屏幕比
    note_detail:"",         //笔记数据
    qrcode_img:"",         //小程序码cloud地址
    qrcode_img_path:"",      //小程序码本地地址
    share_img_path:"" ,      //最终的分享图片，上传到云平台的地址
    share_img_info:"",      //分享图片数据表数据
    local_tmp_image:""      //将网络图片获取到本地，临时存储变量

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //console.log(options)
    that.setData({
      note_id:options.id,
      isDownFile:options.downfile
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
    
    console.log("获取手机窗口结束")

    /**
     * 判断该笔记是否已经存在分享图片
     * 如果存在，就可以直接使用
     */
    var newCreate = 0;
    var sh = that.getShareImageInfo()
    sh.then(function(){//获取分享图片数据
      if (that.data.share_img_info!="")
      {
        newCreate = 1
        console.log("查询到已经存在分享图片:", that.data.share_img_info.image_path)
        var li = that.getImageToLocal1(that.data.share_img_info.image_path)
        li.then(function(){//如果数据存在，将数据保存到小程序端临时文件
          console.log("分享图片已经从云端下载到小程序段")
          that.setData({
            tmpPath: that.data.local_tmp_image  //local_tmp_image是个临时变量，为了getImageToLocal1简单
          })
          that.saveImageToLocal()
        })
      }
      //如果已经存在，停止下面的步骤
      if(newCreate==1)
      {
        return;
      }
    
      /**
       * ---------------生成分享图片开始-----------------------
       */

      //获取笔记详情页的小程序码
      var Qr_res = that._getQrCode()
      Qr_res.then(function(){
        console.log("获取二维码结束")
        //获取笔记相关数据
        var data_res = that._getNoteData(that.data.note_id)
        data_res.then(function(){
          console.log("获取笔记数据结束")
          //console.log(that.data.cover_img)
          //生成图片过程
          //var a = that.getImageToLocal(0)
          var a = that.getImageToLocal1(that.data.imgTim)
          a.then(function(){
            console.log("获取云端背景图片至小程序端成功")
            that.setData({
              backImagePath: that.data.local_tmp_image
            })
            //var a1 = that.getImageToLocal(1)
            var a1 = that.getImageToLocal1(that.data.cover_img)
            a1.then(function(){
              console.log("获取云端封面图片至小程序端成功")
              that.setData({
                cover_img_path: that.data.local_tmp_image
              })
              var b = that.drawContent()
              b.then(function () {//绘图成功
                console.log("绘制图形结束")
                var p = that.toTmpFile()
                p.then(function () {//临时图片生成成功
                  console.log("画图工具生成本地临时图片结束")
                  //上传分享图片的临时文件至云端
                  var s = that._postShareImageToCloud()
                  s.then(function(){
                    console.log("已经将分享图片上传至云端，并且保存数据库")
                    //如果需要下载分享图片，则这里进行下载
                    if (that.data.isDownFile == 1) {
                      that.saveImageToLocal()
                    }
                  })
                })
              })
            })
          })
        })
      })
      /**
       * ---------------生成分享图片结束-----------------------
       */

    })

  },

  /**
   * 上传分享图片至云存储，并且将云文件fileID保存至数据库
   */
  _postShareImageToCloud:function(){
    var that = this
    return new Promise(function(resolve,reject){
      //上传图片
      wx.cloud.uploadFile({
        cloudPath: 'share_image/' + Date.now() + '.png',
        filePath: that.data.tmpPath,    //这是画图工具生成的临时图片
        success: res => {
          that.setData({
            share_img_path:res.fileID
          })
          /**
           * 2019.02.01 arkulo
           * 1. 这里添加分享图片云路径存储在数据库中的功能
           * 2. 要判定如果是从后台来的生成分享图片的请求，则不需要下载图片
           */
          db.collection("share_image").add({
            data: {
              page_id: that.data.note_id,
              page_path: "note",
              image_path: res.fileID
            }
          }).then(res1 => {
            console.log("保存分享图片地址成功!!!")
            resolve("ok")
          })
        },
        fail: err => {
          console.log(err)
        }
      });
    })
  },




  //获取笔记信息
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
          //console.log(res)
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

  //获取页面小程序二维码
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
          //保存云端小程序二维码至本地
          //var p = that.getImageToLocal(2)
          var p = that.getImageToLocal1(that.data.qrcode_img)
          p.then(function(){
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
  getImageToLocal1:function(file_path){
    var that = this
    console.log("分享图片地址：",file_path)
    return new Promise(function(resolve,reject){
        wx.getImageInfo({
          src: file_path,
          success(res){
            that.setData({
              local_tmp_image:res.path
            })
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


  //绘图工具在本地生成临时图片
  toTmpFile:function(){
    var that = this
    return new Promise(function(resolve,reject){
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success(res){
          //console.log("临时图片路径：",res.tempFilePath)
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



  
  /**
   * 保存分享图片至用户手机相册
   */
  saveImageToLocal:function(){
    var that = this
    return new Promise(function(resolve,reject){
      if (that.data.tmpPath=="")
      {
        console.log("that.data.tmpPath变量中没有云端分享图片地址")
        return ;
      }
      wx.saveImageToPhotosAlbum({
        filePath: that.data.tmpPath,
        fail(res){
          console.log("保存失败：",res)
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
   * 查询分享图片在数据库中是否存在
   * 1. 当前页面是note的分享页面，参数是note_id
   * 2. 
   */
  getShareImageInfo:function(){
    var that = this
    return new Promise(function(resolve,reject){
        db.collection("share_image").where({
          page_path:"note",
          page_id:that.data.note_id
        }).get().then(res=>{
          if(res.data.length!=0)
          {
            that.setData({
              share_img_info:res.data[0]
            })
          }
          resolve("ok")
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