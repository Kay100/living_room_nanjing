import { isNumber } from 'lodash';

export const rate = 4;

/*
 *  参数说明
 *  ctx Canvas实例
 *  img 图片地址
 *   x  x轴坐标
 *   y  y轴坐标
 *   w  宽度
 *   h  高度
 *   r  弧度大小
 */
export function drawRoundRect(ctx, img, ...params) {
  let [r, x, y, w, h] = params;
  x = adapter(x);
  y = adapter(y);
  r = adapter(r);
  w = adapter(w);
  h = adapter(h);
  ctx.save();
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  moveTo(ctx, x + r, y);
  arcTo(ctx, x + w, y, x + w, y + h, r);
  arcTo(ctx, x + w, y + h, x, y + h, r);
  arcTo(ctx, x, y + h, x, y, r);
  arcTo(ctx, x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();
  if (img.src) drawImage(ctx, img, x, y, w, h);
  else {
    ctx.fillStyle = img;
    fillRect(ctx, x, y, w, h);
  }
  ctx.restore(); // 返回上一状态
}

/*
str:要绘制的字符串
canvas:canvas对象
initX:绘制字符串起始x坐标
initY:绘制字符串起始y坐标
lineHeight:字行高，自己定义个值即可
canvasWidth:文本宽度
lines: 行数
*/
export function canvasTextAutoLine(ctx, str, initX, initY, lineHeight, canvasWidth, lines) {
  let lineWidth = 0;
  let lastSubStrIndex = 0;
  const beginLineHeight = lineHeight;
  const beginY = initY;
  let $initY = initY;
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width;
    if (lineWidth > canvasWidth) { // 减去initX,防止边界出现的问题
      if ($initY >= beginY + beginLineHeight * (lines - 1)) {
        fillText(ctx, `${str.substring(lastSubStrIndex, i - 1)}...`, initX, $initY);
        return;
      }
      fillText(ctx, str.substring(lastSubStrIndex, i), initX, $initY);
      $initY += lineHeight / 3;
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i === str.length - 1) {
      fillText(ctx, str.substring(lastSubStrIndex, i + 1), initX, $initY);
    }
  }
}

/**
 * 绘制圆形图片
 * @param ctx
 * @param img
 * @param x
 * @param y
 * @param r
 */
export function circleImg(ctx, img, ...params) {
  let [x, y, r] = params;
  x = adapter(x);
  y = adapter(y);
  r = adapter(r);
  ctx.save();
  ctx.beginPath();
  const d = r * 2;
  ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
  ctx.strokeStyle = '#E7DFD0';
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);
  ctx.restore();
}

/**
 * 绘制线段
 * @param ctx
 * @param sx
 * @param sy
 * @param ex
 * @param ey
 * @param color
 */
export function line(ctx, color, x, y, width = 0, height = 0) {
  ctx.lineWidth = 1;
  ctx.beginPath();
  moveTo(ctx, x, y);
  lineTo(ctx, x + width, y + height);
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * 绘制虚线
 * @param cxt
 * @param color
 * @param params
 */
export function dashed(ctx, color, x, y, width) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.setLineDash([6, 6]);
  moveTo(ctx, x, y);
  lineTo(ctx, x + width, y);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

/**
 * @description: 计算canvas渐变起始坐标
 * @param {number} canvas width
 * @param {number} canvas height
 * @param {number} angle 角度
 * @return {*}
 */
export function calculateGradientCoordinate(
  width,
  height,
  angleParam,
) {
  let angle = angleParam || 180;
  if (angle >= 360) angle = angle - 360;
  if (angle < 0) angle = angle + 360;
  angle = Math.round(angle);

  // 从矩形左下角至右上角的对角线的角度
  const alpha = Math.round((Math.asin(width / Math.sqrt(width ** 2 + height ** 2))
      * 180)
    / Math.PI);

  const result = calculateGradientCoordinateSpecial(angle, width, height, alpha);
  if (result) return result;

  // 以矩形的中点为坐标原点，向上为Y轴正方向，向右为X轴正方向建立直角坐标系
  let x0 = 0; let y0 = 0; let x1 = 0; let y1 = 0;

  // 当渐变轴与矩形的交点落在水平线上
  if (
    angle < alpha // 处于第一象限
    || (angle > 180 - alpha && angle < 180) // 处于第二象限
    || (angle > 180 && angle < 180 + alpha) // 处于第三象限
    || angle > 360 - alpha // 处于第四象限
  ) {
    // 将角度乘以（PI/180）即可转换为弧度
    const radian = (angle * Math.PI) / 180;
    // 当在第一或第四象限，y是height / 2，否则y是-height / 2
    const y = angle < alpha || angle > 360 - alpha ? height / 2 : -height / 2;
    const x = Math.tan(radian) * y;
    // 当在第一或第二象限，l是width / 2 - x，否则l是-width / 2 - x
    const l =      angle < alpha || (angle > 180 - alpha && angle < 180)
      ? width / 2 - x
      : -width / 2 - x;
    const n = Math.sin(radian) ** 2 * l;
    x1 = x + n;
    y1 = y + n / Math.tan(radian);
    x0 = -x1;
    y0 = -y1;
  } else if (
    // 当渐变轴与矩形的交点落在垂直线上
    (angle > alpha && angle < 90) // 处于第一象限
    || (angle > 90 && angle < 180 - alpha) // 处于第二象限
    || (angle > 180 + alpha && angle < 270) // 处于第三象限
    || (angle > 270 && angle < 360 - alpha) // 处于第四象限
  ) {
    // 将角度乘以（PI/180）即可转换为弧度
    const radian = ((90 - angle) * Math.PI) / 180;
    // 当在第一或第二象限，x是width / 2，否则x是-width / 2
    const x =      (angle > alpha && angle < 90) || (angle > 90 && angle < 180 - alpha)
      ? width / 2
      : -width / 2;
    const y = Math.tan(radian) * x;
    // 当在第一或第四象限，l是height / 2 - y，否则l是-height / 2 - y
    const l =      (angle > alpha && angle < 90) || (angle > 270 && angle < 360 - alpha)
      ? height / 2 - y
      : -height / 2 - y;
    const n = Math.sin(radian) ** 2 * l;
    x1 = x + n / Math.tan(radian);
    y1 = y + n;
    x0 = -x1;
    y0 = -y1;
  }

  // 坐标系更改为canvas标准，Y轴向下为正方向
  x0 = Math.round(x0 + width / 2);
  y0 = Math.round(height / 2 - y0);
  x1 = Math.round(x1 + width / 2);
  y1 = Math.round(height / 2 - y1);

  return { x0, y0, x1, y1 };
}

/**
 * 计算canvas渐变起始坐标, 处理特殊坐标
 * @param angle
 * @param width
 * @param height
 * @param alpha
 * @returns {null}
 */
function calculateGradientCoordinateSpecial(angle, width, height, alpha) {
  let result = null;
  const widthHalf = Math.round(width / 2);
  const heightHalf = Math.round(height / 2);
  switch (angle) {
    // 当渐变轴垂直于矩形水平边上的两种结果
    case 0:
      result = {
        x0: widthHalf,
        y0: height,
        x1: widthHalf,
        y1: 0,
      };
      break;
    case 180:
      result = {
        x0: widthHalf,
        y0: 0,
        x1: widthHalf,
        y1: height,
      };
      break;
    // 当渐变轴垂直于矩形垂直边上的两种结果
    case 90:
      result = {
        x0: 0,
        y0: heightHalf,
        x1: width,
        y1: heightHalf,
      };
      break;
    case 270:
      result = {
        x0: width,
        y0: heightHalf,
        x1: 0,
        y1: heightHalf,
      };
      break;
    // 当渐变轴分别于矩形的两条对角线重合情况下的四种结果
    case alpha:
      result = {
        x0: 0,
        y0: height,
        x1: width,
        y1: 0,
      };
      break;
    case 180 - alpha:
      result = {
        x0: 0,
        y0: 0,
        x1: width,
        y1: height,
      };
      break;
    case 180 + alpha:
      result = {
        x0: width,
        y0: 0,
        x1: 0,
        y1: height,
      };
      break;
    case 360 - alpha:
      result = {
        x0: width,
        y0: height,
        x1: 0,
        y1: 0,
      };
      break;
  }
  return result;
}

export function fillText(ctx, ...params) {
  return ctx.fillText(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function fillRect(ctx, ...params) {
  return ctx.fillRect(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function drawImage(ctx, ...params) {
  if (!params[0]) return;
  return ctx.drawImage(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function arcTo(ctx, ...params) {
  return ctx.arcTo(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function moveTo(ctx, ...params) {
  return ctx.moveTo(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function translate(ctx, ...params) {
  return ctx.translate(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function lineTo(ctx, ...params) {
  return ctx.lineTo(...params.map(row => (isNumber(row) ? adapter(row) * rate : row)));
}

export function getImageInfo(ctx, canvas, url) {
  if (!url) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const src = /:\/\//.test(url) ? url : `${import.meta.env.VITE_ICON_CDN}/${url}`;
    console.log(src);
    if (url.indexOf(wx.env.USER_DATA_PATH) === 0) {
      const img = canvas.createImage();
      img.src = url;
      resolve(img);
    } else {
      wx.getImageInfo({
        src,
        success: ({ path }) => {
          const img = canvas.createImage();
          img.src = path;
          img.onload = () => {
            resolve(img);
          };
        },
        fail(err) {
          reject(err);
        },
      });
    }
  });
}

/**
 * 适配
 * @param value
 * @param ui
 * @returns {number}
 */
export function adapter(value) {
  // const { screenWidth } = systemInfo;
  // return round(screenWidth / ui * value);
  return value;
}
/**
 * 适配
 * @param value
 * @param ui
 * @returns {number}
 */
export function adapterReverse(value) {
  // const { screenWidth } = systemInfo;
  // return value / screenWidth * ui;
  return value;
}
