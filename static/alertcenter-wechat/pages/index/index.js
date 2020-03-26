//index.js
import api from '../../utils/api.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    form: {
      todo: '',
      name: ''
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          logs.unshift("user:", res.userInfo)
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  subscribeMsgAndSend: function (e) {
    const form = this.data.form;
    const userInfo = this.data.userInfo;
    console.log("---")
    var that=this
    that.setData({
      motto: "订阅中...",
    })
    console.log(e)
    wx.requestSubscribeMessage({
      tmplIds: ['UTZBbCNX1MBg0ISZDMItKG9IyqVrEquka_Q_JMYgCao'],
      success(res) {
        that.setData({
          motto: "订阅成功",
        })

        wx.login({
          success: res => {
            var alertname = form.name
            if (alertname==""){
              alertname="test"
            }
            console.log(res)
            console.log(userInfo)
            api.sendAlert(res.code, userInfo.nickName, alertname)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
      }
    })
    
  }
})
