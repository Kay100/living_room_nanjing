import { ceil, eq, forEach, get, size } from 'lodash';
import icons from '@/config/markers';
import projection from './projection';
import ENV from '@/config/env';
import { strlen } from '@/utils';

const { CDN } = ENV;
const info = wx.getSystemInfoSync();
const rw = info.screenWidth / 375;
const markerWidth = 64; // marker宽度
const markerHeight = 60; // marker高度
const bigMarkerWidth = 60; // 排队时长、演出时间marker宽度
const bigMarkerHeight = 67; // 排队时长、演出时间marker高度
const labelFontSize = 13; // label字体大小
const labelPaddingSingle = 5; // label单边padding值
const labelPadding = labelPaddingSingle * 2;

/**
 * markers加工方法
 *
 * @param {Array} [param.pois] poi数据
 * @param {Object} [param.systemInfo] systemInfo数据
 * @param {Number} [param.avoidType] 避让方式
 * @param {String} [param.typeName] POI类别name
 * @return {Array} markers 集合
 */

const markersFactory = (params) => {
  const { pois, systemInfo, avoidType, typeName, mapType, poi } = params;
  const { isIpx } = systemInfo;
  const responseData = [];
  const numberIconPath = `${CDN}/saas/project/wx8ae3e3f4bf694be6/number/`;
  // 参与聚合时需指定属性 joinCluster 为 true
  const joinCluster = eq(avoidType, 1);
  if (pois && size(pois) > 0) {
    // 数据清洗
    forEach(pois, (item, index) => {
      const { name, shortname, speech, point, scenic_id, spot_id } = item;
      const content = name || shortname;
      const textSize = ceil(strlen(content) / 2);
      const labelX = -(textSize * 12 + 10) / 2;
      // POI样式
      let iconPath = `${icons.spot}.png`;
      let iconPathPressed = `${icons.spot}.png`;
      if (icons[typeName]) {
        iconPath = `${icons[typeName]}.png`;
        iconPathPressed = `${icons[typeName]}_pressed.png`;
      }
      // audio
      if (speech && speech.audio) {
        iconPath = `${icons.voice}.png`;
      }

      let width = markerWidth;
      let height = markerHeight;

      // 路线模式
      if (eq(mapType, 'polyline')) {
        width = 28;
        height = 28;
        iconPath = `${numberIconPath}route_marker_${index + 1}.png`;
      }

      const marker = {
        // name: content,
        // marker 配置
        id: index,
        joinCluster,
        latitude: get(point, 'latitude', '') || item.latitude,
        longitude: get(point, 'longitude', '') || item.longitude,
        zIndex: 1, // 2.3.0后支持，非必填
        width, // 标注图标宽度,默认为图片实际宽度
        height, // 标注图标高度, 默认为图片实际高度
        iconPath, // 显示的图标, 项目目录下的图片路径，支持网络路径、本地路径、代码包路径（2.3.0）
        iconPathPressed,
        scenic_id, // 景区ID
        spot_id, // 景点 id
        show: false,
        customCallout: {
          display: 'ALWAYS',
        }
      };

      // label 配置  label 避让不显示策略
      if (!(point && point.isDodged && poi.id !== item.uid)) {
        marker.label = {
          content, // 文本
          fontSize: 12, // 文字大小
          bgColor: '#fff', // 	背景色
          color: '#333', // 文本颜色
          padding: 5, // 文本边缘留白
          textAlign: 'center', // 文本对齐方式。有效值: left, right, center
          borderRadius: 20, // 边框圆角,
          boxShadow: '0px 2px 4px rgba(83, 83, 83, 0.5)', // 无效属性，需删除
          anchorX: isIpx ? 0 : labelX, // label的坐标，原点是 marker 对应的经纬度
          anchorY: -3, // label的坐标，原点是 marker 对应的经纬度
        };
      }

      responseData[index] = marker;
    });
  }
  return responseData;
};

/**
 * marker避让
 */
function handleMarkerDodge(originPois, mapParam, poi) {
  originPois = transPoi(originPois, mapParam, [1, 1], poi);
  return sortPois(originPois);
}

/**
 * label避让
 */
function handleLabelDodge(originPois, mapParam) {
  return transPoi(originPois, mapParam, [2, 2]);
}

/**
 * marker + label避让
 */
function handleAllPartsDodge(originPois, mapParam, poi) {
  const pois = handleMarkerDodge(originPois, mapParam, poi);
  return handleLabelDodge(pois, mapParam);
}

/**
 * 给原始poi点加入避让信息
 * originPois: 原始的marker坐标点数据
 * mapParam: 用于计算经纬度到屏幕坐标转换的底图参数
 * dodgeType: 避让尺寸
 */
// eslint-disable-next-line default-param-last
function transPoi(originPois, mapParam, dodgeType = [], poi) {
  if (!originPois || originPois.length <= 0) {
    return originPois;
  }
  resetPoi(originPois); // 重置避让状态，防止重复计算避让

  for (let i = 0; i < originPois.length - 1; i++) {
    if (originPois[i].supreme || originPois[i].point.isDodged) {
      continue;
    }
    const projectionPoint1 = getProjectionPoint(
      originPois[i],
      mapParam,
      dodgeType[0],
    );

    for (let j = i + 1; j < originPois.length; j++) {
      if (originPois[j].supreme || originPois[j].point.isDodged) {
        continue;
      }

      const projectionPoint2 = getProjectionPoint(
        originPois[j],
        mapParam,
        dodgeType[1],
      );

      if (isCoincidence(projectionPoint1, projectionPoint2)) {
        if (
          originPois[i]?.priority < originPois[j]?.priority
          || (poi?.spot_id && poi?.spot_id === originPois[j]?.spot_id)
        ) {
          originPois[i].point.isDodged = true;
        } else {
          originPois[j].point.isDodged = true;
        }
      }
    }
  }
  return originPois;
}

/**
 * 根据优先级避让进行排序
 */
function sortPois(originPois) {
  if (!originPois || originPois.length <= 0) {
    return originPois;
  }
  const dodgedArry = [];
  const notDodgedArry = [];
  for (let i = 0; i < originPois.length; i++) {
    if (originPois[i].point.isDodged) {
      dodgedArry.push(originPois[i]);
    } else {
      notDodgedArry.push(originPois[i]);
    }
  }
  return notDodgedArry; // 只返回不用避让的marker
}

/**
 * 重置
 */
function resetPoi(originPois) {
  if (!originPois || originPois.length <= 0) {
    return originPois;
  }
  for (let i = 0; i < originPois.length; i++) {
    originPois[i].point.isDodged = false;
  }
  return originPois;
}

/**
 * 经纬度转像素坐标
 */
function getProjectionPoint(originPoi, mapParam, type) {
  const latlngPoint = originPoi.point;
  const projectionPoint = projection.latlngToPixel(
    latlngPoint.latitude,
    latlngPoint.longitude,
    mapParam.zoom,
  );
  projectionPoint.name = originPoi.name; // name来计算label宽度
  projectionPoint.isDodged = originPoi.point.isDodged;
  projectionPoint.dodgeType = type;
  projectionPoint.bigType = !!originPoi.markerType;
  return projectionPoint;
}

/**
 * 判断是否遮盖
 */
function isCoincidence(p1, p2) {
  const rect1 = getRectSize(p1);
  const rect2 = getRectSize(p2);

  const maxX = rect1.x + rect1.width >= rect2.x + rect2.width
    ? rect1.x + rect1.width
    : rect2.x + rect2.width;
  const maxY = rect1.y + rect1.height >= rect2.y + rect2.height
    ? rect1.y + rect1.height
    : rect2.y + rect2.height;
  const minX = rect1.x <= rect2.x ? rect1.x : rect2.x;
  const minY = rect1.y <= rect2.y ? rect1.y : rect2.y;

  if (
    maxX - minX <= rect1.width + rect2.width
    && maxY - minY <= rect1.height + rect2.height
  ) {
    return true;
  }
  return false;
}

/**
 * 返回两个矩形的尺寸
 */
function getRectSize(point) {
  // 原始的point是marker矩形的底边中心点，首先换算成左下角的点，再进行计算
  let rectWidth;
  let rectHeight;
  let top = [];
  const markerSize = getMarkerSize(point);
  const markerWidth = markerSize.width;
  const markerHeight = markerSize.height;
  const type = point.dodgeType;
  // 三种矩形尺寸
  // 纯marker
  if (type === 1) {
    rectWidth = markerWidth;
    rectHeight = markerHeight;
    top = [point[0] - rectWidth / 2, point[1]];
  }
  // 纯label
  if (type === 2) {
    rectWidth = 1 * parseInt(rw * (point.name.length * labelFontSize + labelPadding), 10);
    rectHeight = 1 * parseInt(rw * (labelPadding + labelFontSize), 10);
    top = [point[0] - rectWidth / 2, point[1] - rectHeight];
  }
  // marker + label
  if (type === 3) {
    rectWidth = Math.max(
      1 * parseInt(rw * (point.name.length * labelFontSize + labelPadding), 10),
      markerWidth,
    );
    rectHeight = 1 * parseInt(rw * (labelPadding + labelFontSize), 10);
    top = [point[0] - rectWidth / 2, point[1] - rectHeight];
    rectHeight += markerHeight;
  }

  return {
    x: top[0],
    y: top[1],
    width: rectWidth,
    height: rectHeight,
  };
}

/**
 * 返回marker尺寸
 */
function getMarkerSize(point) {
  const initalWidth = point.bigType ? bigMarkerWidth : markerWidth;
  const initalHeight = point.bigType ? bigMarkerHeight : markerHeight;

  const iosMarkerSize = {
    width: 1 * parseInt(rw * initalWidth, 10), // iOSmarker默认宽
    height: 1 * parseInt(rw * initalHeight, 10), // iOSmarker默认高
  };
  const androidMarkerSize = {
    width: 1 * parseInt(rw * initalWidth, 10), // androidmarker默认宽
    height: 1 * parseInt(rw * initalHeight, 10), // androidmarker默认高
  };
  const markerSize = info.platform === 'ios' ? iosMarkerSize : androidMarkerSize;
  return markerSize;
}

export { markersFactory, handleMarkerDodge, handleLabelDodge, handleAllPartsDodge };
