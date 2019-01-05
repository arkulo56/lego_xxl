//app.js
App({
  globalData:{
    openid:"",
    share:false,  //默认关闭分享
    height:0  //头部导航栏高度
  },
  onLaunch: function (options) {
    //开启用户追踪，获取用户信息
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}

    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };

    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
  }
})
