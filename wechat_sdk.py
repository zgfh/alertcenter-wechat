#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
@version: 1.0.0
@author: zheng guang
@contact: zg.zhu@daocloud.io
@time: 2020/3/26 8:15 PM
"""

import time
import requests
import logging
from io import BytesIO

logger = logging.getLogger(__name__)


class WxSdk(object):
    def __init__(self, appid, secret, template_id=None):
        self.appid = appid
        self.secret = secret
        self.template_id = template_id
        self.token = None
        self.baseurl = "https://api.weixin.qq.com"

    def get_token(self):
        if not self.token or time.time() > self.token['expires_time']:
            token = requests.post(
                "{}/cgi-bin/token?grant_type=client_credential&appid={}&secret={}".format(self.baseurl,
                                                                                          self.appid,
                                                                                          self.secret)).json()
            token['expires_time'] = time.time() + token['expires_in'] - 100
            self.token = token
        return self.token['access_token']

    def get_openid(self, jscode):
        try:
            s = requests.session()
            s.keep_alive = False
            json_data = s.get(
                '{baseurl}/sns/jscode2session?appid={APPID}&secret={SECRET}&js_code={JSCODE}&grant_type=authorization_code'.format(
                    baseurl=self.baseurl, APPID=self.appid, SECRET=self.secret, JSCODE=jscode)).json()
            s.close()
        except Exception as e:
            logging.exception(e)
            pass
        if json_data.get('errmsg'):
            logger.error("get openid error: %s", json_data)
        return json_data.get('openid', None)  # , json_data.get('unionid', None)

    def getwxacode(self, data, out_path=None):
        url = "{}/wxa/getwxacodeunlimit?access_token={}".format(self.baseurl, self.get_token())
        respose = requests.post(url, json=data)
        if respose.headers['content-type'].split('/')[0] == 'image':
            byteIo = BytesIO(respose.content)
            if out_path:
                with open(out_path, 'wb') as f:
                    f.write(byteIo.read())
            return byteIo
        else:
            byteIo = BytesIO(respose.content)
            logger.error(byteIo.read().decode("utf-8"))
        return byteIo

    def subscribe_send(self, touser, data):
        '''
        推送订阅消息
        docs: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html
        :param touser:
        :param msg:
        :return:
        '''
        result = requests.post(
            "{}/cgi-bin/message/subscribe/send?access_token={}".format(self.baseurl,
                                                                       self.get_token()),
            json={
                "touser": touser,
                "template_id": self.template_id,
                "page": "index",
                "miniprogram_state": "developer",
                "lang": "zh_CN",
                "data": data
            }
        ).json()
        return result
