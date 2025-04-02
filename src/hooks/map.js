import { eq, split } from 'lodash';
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { useMap } from '@/store';

const { mapStyle } = storeToRefs(useMap());

export default function init(mapCtx) {
  // 绘制手绘
  watchEffect(() => {
    if (!mapCtx || !mapStyle.value) return;
    const { layerId } = mapStyle.value;
    if (layerId) {
      split(layerId, ',').map((id) => {
        mapCtx.addCustomLayer({
          layerId: String(id),
          fail(e) {
            console.log(e, 'add fail', id);
          },
          success(res) {
            console.log(res, 'add success', id);
          },
        });
      });
    }
  });

  // 地理围栏，超出范围回弹
  return function regionRange(event) {
    if (!mapStyle.value) return;

    const { rangeNE, rangeSW, latitude, longitude } = mapStyle.value;

    const { causedBy } = event;

    if (rangeSW && rangeNE && (eq(causedBy, 'drag') || eq(causedBy, 'update'))) {
      mapCtx.getRegion({
        success: (region) => {
          console.log('室外-Region', region);
          const { southwest, northeast } = region;
          // 判断西南、东北角度是否在范围内
          let inscope = true;
          if (southwest.latitude < rangeSW[0] || southwest.longitude < rangeSW[1]) {
            inscope = false;
            console.log('室外-西南角不满足要求');
          }
          if (inscope && (northeast.latitude > rangeNE[0] || southwest.longitude > rangeNE[1])) {
            console.log('室外-东北角不满足要求');
            inscope = false;
          }
          if (!inscope) {
            console.log('尝试移动到中心位置', latitude, longitude);
            mapCtx.moveToLocation({ latitude, longitude });
          }
        },
      });
    }
  };
}
