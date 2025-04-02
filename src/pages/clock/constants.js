import { ceil, forEach, floor } from 'lodash';
import poiOptions from '@/config/poi';
import { strlen } from '@/utils';
import { systemInfo } from '@/mixins';
import { fillRect, fillText, getImageInfo, drawImage, rate } from '@/utils/canvas';

export const TemperamentCard = [
  { id: 1, pic: '1672148374447_M8KdRbDA.png' },
  { id: 2, pic: '1672148374613_TnP84XH9.png' },
  { id: 3, pic: '1672148374565_fxKRMK6K.png' },
  { id: 4, pic: '1672148374404_T78biFrC.png' },
  { id: 5, pic: '1672148374641_waJaj3WH.png' },
  { id: 6, pic: '1672148374497_mwJDH2Sc.png' },
];

export function initMarker(pois, currentId, clockList, scale = 16) {
  const markers = [];
  const { isIpx } = systemInfo();
  const ratio = scale < 18 ? 0.7 : 1;

  forEach(pois, (poi, index) => {
    const poiOption = poiOptions.find((option) => option.id === Number(poi.spot_id));
    if (!poiOption) return;
    const textSize = ceil(strlen(poi.name) / 2);
    const fontSize = 13 * ratio;
    const padding = 10 * ratio;
    const labelX = -(textSize * fontSize + padding) / 2;

    const marker = {
      id: poiOption.id,
      width: 80,
      height: 54,
      iconPath: `${import.meta.env.VITE_ICON_CDN}/${poiOption.marker}`,
      zIndex: index,
      ...poi.point,
    };
    const label = {
      content: poi.name,
      fontSize, // 文字大小
      bgColor: '#fff', // 	背景色
      color: '#333', // 文本颜色
      padding, // 文本边缘留白
      textAlign: 'center', // 文本对齐方式。有效值: left, right, center
      borderRadius: 20 * ratio, // 边框圆角,
      boxShadow: '0px 2px 4px rgba(83, 83, 83, 0.5)', // 无效属性，需删除
      anchorX: isIpx ? 0 : labelX, // label的坐标，原点是 marker 对应的经纬度
      anchorY: -3, // label的坐标，原点是 marker 对应的经纬度
    };

    if (currentId && currentId === poi.spot_id) {
      marker.iconPath = `${import.meta.env.VITE_ICON_CDN}/1675663784116_kMMxNa1x.png`;
      marker.width = 91;
      marker.height = 59;
      marker.zIndex = 999999;
      label.anchorY = 3;
    }

    if (currentId !== poi.spot_id && clockList && clockList.find((row) => row.spot_id === poi.spot_id)) {
      marker.iconPath = `${import.meta.env.VITE_ICON_CDN}/${poiOption.marker_clock}`;
      marker.width = 82;
      marker.height = 58;
    }

    marker.label = label;
    marker.width = floor(ratio * marker.width);
    marker.height = floor(ratio * marker.height);

    markers.push(marker);
  });

  return markers;
}

/**
 * 生成珍宝图片
 * @param services
 * @returns {Promise<unknown>}
 */
export async function init(services) {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        // Canvas 对象
        const canvas = res[0].node;
        // 渲染上下文
        const ctx = canvas.getContext('2d');

        // Canvas 画布的实际绘制宽高
        const width = 375;
        const height = 730;

        canvas.width = width * rate;
        canvas.height = height * rate;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#FFFFFF';
        fillRect(ctx, 0, 0, width, height);

        const imgBackground = await getImageInfo(ctx, canvas, '1676033119967_DYshRpWE.jpg');
        drawImage(ctx, imgBackground, 0, 0, width, height);

        const imgKeepsake = await getImageInfo(ctx, canvas, services.keepsakePhoto);
        drawImage(ctx, imgKeepsake, 82, 185, 210, 210);

        const imgQrcode = await getImageInfo(ctx, canvas, '1677832430896_EKbWCyfC.jpg');
        drawImage(ctx, imgQrcode, 265, 591, 80, 80);

        // 绘制文本
        ctx.font = `900 ${20 * rate}px HYXinRenWenSong`;
        ctx.fillStyle = '#289C8D';
        fillText(ctx, services.keepsakeInfo, 51, 442);

        // 绘制文本
        ctx.font = `900 ${20 * rate}px HYXinRenWenSong`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        fillText(ctx, `您已解锁信物「${services.keepsake}」`, 51, 472);

        // 绘制文本
        if (services.name) {
          const imgLocation = await getImageInfo(ctx, canvas, '1672146910995_mn4NdPsa.png');
          drawImage(ctx, imgLocation, 51, 489, 16, 16);

          ctx.font = `400 ${14 * rate}px PingFang SC`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          fillText(ctx, `南京文学客厅·${services.name}`, 71, 502);
        }

        resolve(canvas);
      });
  });
}

/**
 * 生成气质卡图片
 * @param services
 * @returns {Promise<unknown>}
 */
export async function initCanvas(name, card, canvasId = '#canvasAll') {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .select(canvasId)
      .fields({ node: true, size: true })
      .exec(async (res) => {
        // Canvas 对象
        const canvas = res[0].node;
        // 渲染上下文
        const ctx = canvas.getContext('2d');

        // Canvas 画布的实际绘制宽高
        const width = 375;
        const height = 730;

        canvas.width = width * rate;
        canvas.height = height * rate;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#FFFFFF';
        fillRect(ctx, 0, 0, width, height);

        const imgBackground = await getImageInfo(ctx, canvas, '1672223030537_E4epTaHK.png');
        drawImage(ctx, imgBackground, 0, 0, width, height);

        const imgKeepsake = await getImageInfo(ctx, canvas, card.pic);
        drawImage(ctx, imgKeepsake, 30, 54, 315, 505);

        const imgQrcode = await getImageInfo(ctx, canvas, '1677832430896_EKbWCyfC.jpg');
        drawImage(ctx, imgQrcode, 265, 605, 80, 80);

        // 绘制文本
        ctx.font = `${12 * rate}px PingFang SC`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        fillText(ctx, `${name} 的文人气质卡`, 50, 543);

        resolve(canvas);
      });
  });
}
