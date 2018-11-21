function formatTime(date,style) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if(style==1)
  {
    return year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
  }
  if(style==2)
  {
    return year+"-"+month+"-"+day;
  }
  return year + "-" + month + "-" + day+" "+hour+":"+minute+":"+second;
}

module.exports = {
  formatTime: formatTime
}