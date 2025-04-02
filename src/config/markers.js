const path = `${import.meta.env.VITE_ICON_CDN}/marker`;

const markers = {
  spot: `${path}/spot`, // 景点
  parking: `${path}/parking`, // 停车场
  toilet: `${path}/toilet`, // 卫生间
  restaurant: `${path}/restaurant`, // 餐饮
  exit: `${path}/exit`, // 出入口
  serve: `${path}/serve`, // 服务点
  hotel: `${path}/hotel`, // 住宿
  others: `${path}/others`, // 其他
  // 语音
  voice: `${path}/voice`, // 语音
  shooting: `${path}/shooting`,
};

export default markers;
