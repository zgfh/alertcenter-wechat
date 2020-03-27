// pages/about_me/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg : `curl -H 'Content-Type: application/json' -d '{"openid": "` + app.globalData.openid + `", "data": { "thing1": {"value": alertName },"thing2": {"value": "测试告警，来自:xx"},"thing3": { "value": "测试告警，来自:" + userName},"date4": {"value": "xxx")},"thing5": {"value": "地球"}}}' https://alertcenter.daozzg.com/alerts`
  },

  /**
   * 生命周期函数--监听页面加载https://alertcenter.daozzg.com/alerts
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})