/**
 * 需要分享的页面的底部分享导航
 * 1. 第一个按钮是直接跳转首页
 * 2. 第二个是页面内部转发功能，采用button绑定open-type='share'实现，但onShareAppMessage由
 * 调用页面自行实现
 * 3. 发送朋友圈功能直接跳转至自己实现的分享图片生成页面，下载海报成功后，会跳转回来
 * 
 * 
 * Input:
 * properties中定义了分享的原始页面和主键，知道原始页面地址，通过sharePages数组就能找到应该跳转去哪个分享页面
 * 在调用方，wxml中：<navbar from-page="pages/note2/detail" page-id="{{detail._id}}"></navbar>
 * 
 */

import Dialog from '../../dist/dialog/dialog';

var sharePages = {};
sharePages["pages/note2/detail"] ="../page_share/index"

const app = getApp()
Component({
  properties: {
    fromPage:String,   //扫码海报跳转的原始页面
    pageId:String,      //分享页面对应的主键
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
      //console.log(this.properties.fromPage,":",this.properties.pageId)
      var targetUrl = "";

      if (this.properties.fromPage && this.properties.pageId)
      {
        if (sharePages.hasOwnProperty(this.properties.fromPage)) {
          targetUrl = sharePages[this.properties.fromPage] + "?id=" + this.properties.pageId
        } else {
          console.log("没有找到指定的分享页面")
        }


        Dialog.alert({
          title: '生成图片分享',
          message: '分享图片将保存在您的相册中，请在朋友圈分享，谢谢！'
        }).then(() => {
          wx.navigateTo({
            url: targetUrl,
          })
        });
      }
    }
  }
})
