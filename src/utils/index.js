/* eslint-disable */

/*
 * @fileoverview | 常用工具函数
 * @version 0.2 | 2021-10-12 10:18:40
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-12 15:26:37
 */

import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';

export function safeJsonStringInBrowser(str, removed) {
  // 四个特殊换行符会导致浏览器json解析出错，需要处理。see this: http://timelessrepo.com/json-isnt-a-javascript-subset
  // 如果 removed 为true，则将特殊字符删掉
  return str
    .replace(/\u2028/g, removed ? '' : '\\u2028')
    .replace(/\u2029/g, removed ? '' : '\\u2029')
    .replace(/\u000A/gi, removed ? '' : '\\n')
    .replace(/\u000D/gi, removed ? '' : '\\r');
}

// number单位数转换两位数
export function getTransformNumber(value, type = 'string') {
  const newVal = value < 10 ? `0${value}` : value;
  return !type || type === 'string' ? String(newVal) : Number(newVal);
}
/**
 * @date     2020-07-13
 * @time     时间戳毫秒数
 * @desc     获取日期，如20180705或指定格式间隔符
 * @returns  String
 * @author   mukuashi | kuashimu@tencent.com
 */
export function getCurrentDate(time, insert = '') {
  const date = time ? new Date(time) : new Date();
  const year = date.getFullYear();
  const month = getTransformNumber(date.getMonth() + 1);
  const day = getTransformNumber(date.getDate());
  const week = ['末', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return insert ? [year, month, day, week].join(insert) : [year, month, day, week];
}
/**
 * 时间戳转时间
 * @param  Number date timestamp
 */
export function getTimestampDate(time) {
  const currentDate = getCurrentDate(new Date(Number(time)));
  const date = new Date(Number(time));
  const h = date.getHours() < 12 ? `上午${date.getHours()}` : `下午${date.getHours()}`;
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${currentDate[0]}年${currentDate[1]}月${currentDate[2]}日 ${h}:${m}`;
}

/**
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function getUid(len = 32, firstU = true, radix = null) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  radix = radix || chars.length;

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
  if (firstU) {
    uuid.shift();
    return `u${uuid.join('')}`;
  }
  return uuid.join('');
}

/**
 * @date 2020-12-06
 * @desc   添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
 * @param  (value & unit)
 * @author kuashimu@tencent.com
 */
export function addUnit(value = 'auto', unit = 'rpx') {
  // 用内置验证规则中的number判断是否为数值
  return isNumber(value) ? `${value}${unit}` : value;
}
/**
 * @date  2020-12-06
 * @desc  判断点是否在单面内
 * @param {*} point 当前坐标
 * @param {*} polygonPoints 对应面多边形
 * @author kuashimu@tencent.com
 */
export function isInside(point, polygonPoints) {
  let inside = false;

  if (!point || !polygonPoints || !polygonPoints.length) {
    return inside;
  }

  const x = point.latitude;
  const y = point.longitude;

  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = parseFloat(polygonPoints[i].latitude);
    const yi = parseFloat(polygonPoints[i].longitude);
    const xj = parseFloat(polygonPoints[j].latitude);
    const yj = parseFloat(polygonPoints[j].longitude);

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * @date  2020-12-06
 * @desc  判断一个点是否在多边形内(多面)
 * @param {*} point 当前坐标
 * @param {*} aoi 对应面多边形
 * @author kuashimu@tencent.com
 */
export function isInPolygon(point, aoi) {
  if (!point || !aoi || !aoi.length) {
    return false;
  }
  for (const row of aoi) {
    if (isInside(point, row)) {
      return true;
    }
  }
  return false;
}

/**
 * 通过经纬度坐标获取墨卡托坐标
 * @param {Object}  包含经纬度的json
 */
export function toMercator(options) {
  const MAXEXTENT = 20037508.342789244;
  const A = 6378137.0;
  const D2R = Math.PI / 180;
  const latitude = options.latitude || options.lat;
  const longitude = options.longitude || options.lng;
  const xy = [A * longitude * D2R, A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * latitude * D2R))];
  // if xy value is beyond maxextent (e.g. poles), return maxextent.
  xy[0] > MAXEXTENT && (xy[0] = MAXEXTENT);
  xy[0] < -MAXEXTENT && (xy[0] = -MAXEXTENT);
  xy[1] > MAXEXTENT && (xy[1] = MAXEXTENT);
  xy[1] < -MAXEXTENT && (xy[1] = -MAXEXTENT);
  return {
    x: xy[0],
    y: xy[1],
  };
}

/**
 * 墨卡托转经纬度
 */
export function toLatLng(point) {
  if (point == null) {
    return null;
  }
  // EPSG:900913 正轴墨卡托投影坐
  const flonConver = (point.x * 180) / 20037508.34;
  let flatConver = (point.y * 180) / 20037508.34;

  flatConver = (180 / Math.PI) * (2 * Math.atan(Math.exp((flatConver * Math.PI) / 180)) - Math.PI / 2);

  return {
    lat: flatConver,
    lng: flonConver,
  };
}

/**
 * 距离单位换算
 * @param  Number
 * @param prex 前缀
 */
export function distanceUnit(dis, prex = '距你') {
  if (!dis) return `${prex}0米`;
  if (dis < 1000) return `${prex}${dis.toFixed(0)}米`;
  return `${prex}${(Math.round(dis / 100) / 10).toFixed(0)}公里`;
}

/**
 * 计算两点距离
 * @param {Object}  包含经纬度坐标的json
 * {  x: xxx米 y: xxx米 }
 */

export function getDistance(p1, p2) {
  p1 = toMercator(p1);
  p2 = toMercator(p2);
  const a = Math.abs(p1.x - p2.x);
  const b = Math.abs(p1.y - p2.y);
  return Math.pow(a * a + b * b, 0.5);
}

/**
 * 2021-03-15
 * @desc 16进制颜色值转rgba值，支持透明度配置
 * @param {*} hex
 * @param {*} opacity
 * @returns rgba
 * @author kuashimu@tencent.com
 */
export function getHexToRgba(hex, opacity) {
  return `rgba(${parseInt(`0x${hex.slice(1, 3)}`)},${parseInt(`0x${hex.slice(3, 5)}`)},${parseInt(
    `0x${hex.slice(5, 7)}`,
  )},${opacity})`;
}

/**
 * map points对坐标数据加工
 * @param {*} points
 */
export function getPolygonPoints(points, result = []) {
  if (!points || !isArray(points)) return;
  for (const row of points) {
    if (isArray(row) && row?.length) {
      getPolygonPoints(row, result);
    } else {
      row.latitude = Number(row.latitude);
      row.longitude = Number(row.longitude);
    }
  }
  return points;
}

/**
 * https://developers.weixin.qq.com/miniprogram/dev/extended/service/translator.html#%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90
 * 微信同声传译插件错误信息处理
 */
export function getTTSPluginFail(err = {}) {
  const errorText = {
    '-20001': '语音合成语言格式出错',
    '-20002': '输入的待合成格式不正确',
    '-20003': '语音合成内部错误',
    '-20005': '网络错误',
    '-40001': '接口调用频率达到限制，请联系插件开发者',
  };
  return errorText[err.retcode || '20001'];
}

/**
 * url加工
 */
export function makeUrl(path) {
  if (/^http|https/i.test(path)) return path;
  return `https://${path}`;
}

/**
 * @description 把对象拼接成 a=b&c=d 形式的字符串
 * @param       {Object} queryObj  需要进行序列化的对象
 * @returns     {String} 拼接后的字符串
 */
export function serialize(queryObj = {}, strify = false) {
  if (!queryObj) {
    return '';
  }
  const queryArray = [];
  if (strify) {
    Object.keys(queryObj).forEach((key) => {
      const item = queryObj[key];
      if (item || item === 0) {
        let value = queryObj[key];
        if (isArray(value) && value) {
          value = JSON.stringify(value);
        }
        queryArray.push(`${key}=${value}`);
      }
    });
    return queryArray.join('&');
  }
  Object.keys(queryObj).forEach((key) => {
    queryArray.push(`${key}=${queryObj[key]}`);
  });
  return queryArray.join('&');
}

/**
 * @desc 正则匹配一段url
 * @param  {any} string
 * @return {any} Boolean
 */
export function isUrl(param) {
  // eslint-disable-next-line no-useless-escape
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
  return reg.test(param);
}

/**
 * 计算字符串长度，（英文占1个字符，中文汉字占2个字符）
 * @param str
 * @returns {number}
 */
export function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

/**
 * 包装方法，N秒后才能执行callback
 * @param callback
 * @param time 单位秒
 * @returns {(function())|*}
 */
export function wrapTime(callback, time = 2) {
  const now = Date.now();
  return () => {
    if (Date.now() - now > time * 1000) callback();
  };
}
