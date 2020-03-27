//index.js
import api from '../../utils/api.js'
import Notify from '../../vant/components/notify/notify';
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '点击订阅后才能发送消息,如果需要发送请设置告警名',
    userInfo: {},
    form: {
      description: '',
      name: ''
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  subscribeMsg: function(e) {
    var that = this
    that.setData({
      motto: "订阅中...",
    })
    wx.requestSubscribeMessage({
      tmplIds: app.globalData.tmplIds,
      success(res) {
        that.setData({
          motto: `订阅成功,你可以通过curl -H 'Content-Type: application/json' -d '{"name":"xx","description":"xx"}' https:/ / alertcenter.daozzg.com / alerts / xx 发送告警`,
        })
      }
    })

  },
  onChange: function(e) {
    var that = this
    let form = that.data.form
    form.name = e.detail
    console.log(e.detail)
    that.setData({
      form: form
    })
    console.log("alertnane: ", form.name, that.data)
  },
  subscribeMsgAndSend: function(e) {
    this.setData({
      form: e.detail.value
    })
    var form = this.data.form;
    const userInfo = this.data.userInfo;
    var that = this
    that.setData({
      motto: "订阅中...",
    })
    console.log(e)
    wx.requestSubscribeMessage({
      tmplIds: app.globalData.tmplIds,
      success(res) {
        that.setData({
          motto: `订阅成功`,
        })
        console.log("form:", form)
        var alertname = form.name
        if (alertname == "") {
          Notify('订阅成功,告警名未设置忽略发送消息');
          return
        }
        console.log("send alert", userInfo)
        api.sendAlert(app.globalData.openid, userInfo.nickName, alertname, form.description)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

  }
})