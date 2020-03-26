from flask import Flask, request, jsonify
from wechat_sdk import WxSdk
import os
import logging

app = Flask(__name__)

wxSdk = WxSdk(os.getenv("WX_OPENID", ""), os.getenv("WX_APPSECRET", ""), os.getenv("WX_TEMPLATE_ID", ""))


@app.route('/')
def index():
    return 'alertcenter-wechat api'


@app.route('/alerts', methods=['POST'])
def Addalerts():
    data = request.get_json()
    openid = wxSdk.get_openid(data['code'])
    app.logger.info("openid: %s alert data: %s", openid, data)
    result = wxSdk.subscribe_send(openid, data['data'])
    app.logger.info("subscribe_msg_send result: %s", result)
    return jsonify({"result": "ok"})


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(name)s %(levelname)-8s %(message)s')

    logging.info("alertcenter-wechat api start")
    app.run(host='0.0.0.0', port=5000, debug=False)
