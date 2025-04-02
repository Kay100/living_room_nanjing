/*
 * @fileoverview | 新导览渠道接口封装
 * @version 0.1 | 2021-10-27 17:44:52
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-12 15:27:12
 * @Document | https://iwiki.woa.com/pages/viewpage.action?pageId=1128568707
 */

import md5 from 'md5';
import keys from 'lodash/keys';
import each from 'lodash/each';
import { serialize } from '@/utils';

const app = 'wisdom_scenic';
const secret = 'gBtshVoSZriuTIxf';

function request(param) {
  return new Promise((resolve, reject) => {
    const defSuccess = (res) => {
      resolve(res.data);
    };
    const { success = defSuccess, fail = reject, ...etc } = param;
    wx.request({ success, fail, ...etc });
  });
};

class API {
  constructor(opt) {
    this.options = opt;
  }

  async doRequest(path, param, method = 'POST', header = {}) {
    // 最终请求网址
    const url = `${this.options}${path}`;
    // 验签
    const ordered = {};
    const keya = keys(param).sort();
    each(keya, (key) => {
      ordered[key] = param[key];
    });
    const ts = Math.round(new Date() / 1000);
    // header
    const headers = {
      ...header,
      app,
      ts,
      sign: md5(`${app}${secret}${ts}${serialize(ordered, true)}`),
    };
    // 请求
    const res = await request({
      url,
      data: param,
      method,
      header: headers,
    });
    return res;
  }

  post(path, param, header) {
    return this.doRequest(path, param, 'POST', header);
  }

  get(path, param, header) {
    return this.doRequest(path, param, 'GET', header);
  }
}

export default API;
