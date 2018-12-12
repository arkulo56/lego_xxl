/**
 * 获取小程序码功能
 * 0. 先判断数据库（qrcode表）中是否已经存在该二维码，如果存在直接返回
 * 1. 因为是云开发模式，之前的用户鉴权是不需要获取token的，所以第一步是获取token
 * 2. 获得token之后，拿着token去获取小程序码
 */

//涉及到的相关框架
const axios = require('axios')
var rp = require('request-promise');
const cloud = require('wx-server-sdk')
//初始化云函数
cloud.init()
//初始化数据库
const db = cloud.database()


var appId = "wxab201c3be12abbd9";
var appSecret = "43512457e8e783e646787ad443453b04";

// 云函数入口函数
exports.main = async (event, context) => {
  //console.log(event)
  
  //查询数据库中是否存在这个页面的二维码
  var res = await db.collection("qrcode").where({
    moduleKey:event.moduleKey,
    params:event.params
  }).get()

  if (typeof (res.data[0]) !="undefined")
  {
    return res.data[0].img_path
  }
  
  try {
    //获取token
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret
    const resultValue = await rp(url)
    const token = JSON.parse(resultValue).access_token;
    
    //获取二维码流数据
    const response = await axios({
      method: 'post',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      responseType: 'stream',
      params: {
        access_token: token
      },
      data: {
        page: event.page,
        width: 300,
        scene: event.id,
      },
    });

    //上传图片
    const upload_res = await cloud.uploadFile({
      cloudPath: 'xcxcodeimages/' + Date.now() + '.png',
      fileContent: response.data,
    });
    //console.log(response)
    //保存数据库
    await db.collection("qrcode").add({
      data:{
        moduleKey:event.moduleKey,
        params:event.params,
        img_path:upload_res.fileID
      }
    })

    return upload_res.fileID

  } catch (err) {
    console.log('>>>>>> ERROR:', err)
  }

}

