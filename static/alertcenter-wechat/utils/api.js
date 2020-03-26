import request from './request.js'
import util from './util.js'
export default {
  sendAlert(code, userName, alertName) {
    return request.post('/alerts', {
      "code": code,
      "data": {
        "thing1": {
          "value": alertName
        },
        "thing2": {
          "value": "测试告警，来自:" + userName
        },
        "thing3": {
          "value": "测试告警，来自:" + userName
        },
        "date4": {
          "value": util.formatTime(new Date())
        },
        "thing5": {
          "value": "地球"
        }
      }
    })
  }
}