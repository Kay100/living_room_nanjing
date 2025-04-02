/* eslint-disable */
// projection.js

// 地球半径（米）
const EARTH_RADIUS = 6378137.0;

// 0级 米/ 像素
const RESOLUTION = (2.0 * Math.PI * EARTH_RADIUS) / 256;

// 地球周长的一半
const ORIGIN_SHIFT = (2.0 * Math.PI * EARTH_RADIUS) / 2.0;

/**
 * 计算指定比例尺下的米/像素
 */
function resolution(zoom) {
  return RESOLUTION / Math.pow(2, zoom);
}

/**
 * 经纬度转平面坐标（米）
 */
function latlngToMeter(lat, lng) {
  const mx = (lng * ORIGIN_SHIFT) / 180.0;
  let my =    Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
  my = (my * ORIGIN_SHIFT) / 180.0;

  return [mx, my];
}

/**
 * 平面坐标（米）转经纬度
 */
function meterToLatLng(mx, my) {
  const lng = (mx / ORIGIN_SHIFT) * 180.0;
  let lat = (my / ORIGIN_SHIFT) * 180.0;
  lat =    (180.0 / Math.PI)
    * (2 * Math.atan(Math.exp((lat * Math.PI) / 180.0)) - Math.PI / 2.0);

  return [lat, lng];
}

/**
 * 像素坐标转平面坐标（米）
 */
function pixelToMeter(px, py, zoom) {
  const res = resolution(zoom);
  const mx = px * res - ORIGIN_SHIFT;
  const my = py * res - ORIGIN_SHIFT;

  return [mx, my];
}

/**
 * 平面坐标转像素坐标
 */
function meterToPixel(mx, my, zoom) {
  const res = resolution(zoom);
  const px = (mx + ORIGIN_SHIFT) / res;
  const py = (my + ORIGIN_SHIFT) / res;

  return [px, py];
}

/**
 * 像素坐标转经纬度
 */
function pixelToLatLng(px, py, zoom) {
  const ret = pixelToMeter(px, py, zoom);
  return meterToLatLng(ret[0], ret[1]);
}

/**
 * 经纬度转像素坐标
 */
function latlngToPixel(lat, lng, zoom) {
  const ret = latlngToMeter(lat, lng);
  return meterToPixel(ret[0], ret[1], zoom);
}

/**
 * 经纬度转屏幕坐标
 */
function latlngToScreenPixel(lat, lng, mapParam) {
  if (mapParam == null) {
    return null;
  }

  const ret1 = latlngToPixel(lat, lng, mapParam.zoom);
  const px1 = ret1[0];
  const py1 = ret1[1];

  const ret2 = latlngToPixel(mapParam.lat, mapParam.lng, mapParam.zoom);
  const px2 = ret2[0];
  const py2 = ret2[1];

  return [
    px1 - px2 + mapParam.mapViewWidth / 2,
    py2 - py1 + mapParam.mapViewHeight / 2,
  ];
}

export default {
  latlngToMeter,
  meterToLatLng,
  pixelToMeter,
  meterToPixel,
  pixelToLatLng,
  latlngToPixel,
  latlngToScreenPixel,
};
