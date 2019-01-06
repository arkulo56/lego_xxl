/**
 * 需要分享的页面的底部分享导航
 * 1. 第一个按钮是直接跳转首页
 * 2. 第二个是页面内部转发功能，采用button绑定open-type='share'实现，但onShareAppMessage由
 * 调用页面自行实现
 * 3. 发送朋友圈功能直接跳转至自己实现的分享图片生成页面，下载海报成功后，会跳转回来
 */

const app = getApp()
Component({
  properties: {
    targetUrl:String,   //生成朋友圈海报地址，这里由外部调用页面直接将分享页面（包括参数id）传进来
  },
  data: {
  },
  attached: function () {
  },
  methods: {
    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    //朋友圈海报
    _shareQuan(){
      if (this.properties.targetUrl)
      {
        wx.navigateTo({
          url: taregtUrl
        })
      }
    }
  }
})
