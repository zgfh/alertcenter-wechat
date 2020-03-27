from flask import Flask, request, jsonify
from wechat_sdk import WxSdk
import os
import logging

app = Flask(__name__)

wxSdk = WxSdk(os.getenv("WX_OPENID", ""), os.getenv("WX_APPSECRET", ""), os.getenv("WX_TEMPLATE_ID", ""))


@app.route('/')
def index():
    return 'alertcenter-wechat api'


@app.route('/users', methods=['POST'])
def login():
    code = request.get_json().get('code', '')
    if code == "":
        return jsonify({"result": "need code"}), 400
    openid = wxSdk.get_openid(code)
    app.logger.info("openid: get %s  with code: %s", openid, code)
    return jsonify({"openid": openid})


@app.route('/alerts', methods=['POST'])
def Addalerts():
    data = request.get_json()
    openid = data.get('openid')
    msg_data = data.get('data')
    app.logger.info("openid: %s alert data: %s", openid, data)
    if not openid or not msg_data:
        return jsonify({"result": "need openid,msg_data"}), 400
    result = wxSdk.subscribe_send(openid, msg_data)
    app.logger.info("subscribe_msg_send result: %s", result)
    return jsonify({"result": "ok"})


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(name)s %(levelname)-8s %(message)s')

    logging.info("alertcenter-wechat api start")
    app.run(host='0.0.0.0', port=5000, debug=False)
