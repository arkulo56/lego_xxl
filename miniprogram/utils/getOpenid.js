
function getOpenid()
{
  return new Promise(function(resolve,reject){
    const app = getApp()
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        //console.log("内部：", app.globalData.openid)
        resolve("ok")
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  })
}


module.exports = {
  getOpenid:getOpenid
}