//app.js
App({
  globalData:{
    openid:"",
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

  }
})
