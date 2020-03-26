import config from './config.js'

class Request {
  constructor(parms) {
    this._baseUrl = parms.baseURL
  }

  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * GET类型的网络请求
   */
  get(url, data, header) {
    return this.request(url, data, header, 'GET')
  }

  /**
   * DELETE类型的网络请求
   */
  delete(url, data, header) {
    return this.request(url, data, header, 'DELETE')
  }

  /**
   * PUT类型的网络请求
   */
  put(url, data, header) {
    return this.request(url, data, header, 'PUT')
  }

  /**
   * POST类型的网络请求
   */
  post(url, data, header) {
    return this.request(url, data, header, 'POST')
  }

  /**
   * 网络请求
   */
  request(url, data, header, method) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token')
      wx.request({
        url: this._baseUrl ? this._baseUrl + url : url,
        data: data,
        header: {
          ...header,
          'Authorization': token ? `Bearer ${token}` : ''
        },
        method: method,
        success: (res => {
          const code = res.statusCode
          switch (true) {
            case code >= 200 && code <= 399:
              //200,201: 服务端业务处理正常结束
              resolve(res)
              break;
            case code === 401:
              // 401: token失效，清除本地数据，提示重新登录
              wx.clearStorageSync()
              wx.showToast({
                title: '登录信息已过期,请重新登录',
                icon: 'none'
              })
              // wx.redirectTo({
              //   url: '/pages/index/index',
              // })
              break;
            case code >= 500:
              // 500: 服务器发生异常
              wx.showToast({
                title: '服务器发生异常',
                icon: 'none'
              })
              break;
            default:
              //其它错误，提示用户错误信息
              if (this._errorHandler != null) {
                //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
                this._errorHandler(res)
              }
              reject(res)
              break;
          }
        }),
        fail: (res => {
          if (this._errorHandler != null) {
            this._errorHandler(res)
          }
          wx.showToast({
            title: '网络发生异常',
            icon: 'none'
          })
        })
      })
    })
  }
}

const request = new Request({
  baseURL: config.BASE_URL
})

export default request