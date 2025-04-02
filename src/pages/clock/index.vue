<template>
  <div class="flex-layer" :class="stepClass">
    <div class="header">
      <tm-nav />
    </div>
    <div class="layer-content" v-if="getMapStyle">
      <map
        id="mapContext"
        class="map"
        show-location
        subkey="E3IBZ-47GLU-3LHVJ-BPJU3-GEB4E-OTFMQ"
        :markers="markers"
        :polyline="polylines"
        :scale="scale"
        :min-scale="16"
        :latitude="getMapStyle.latitude"
        :longitude="getMapStyle.longitude"
        @markertap="handleClock"
        @regionchange="handleRegionChange"
      />
      <div class="map-guide"></div>

      <div class="mock-loc-btn" @click="navigateTo('GUIDE_LOCATION')" v-if="isMock">
        <div>
          <div>mock</div>
        </div>
      </div>

      <div class="location-btn" @click="handleLocation">
        <div class="icon">
          <img class="img" :src="cdn + '/icon_location_btn.svg'" />
        </div>
      </div>

      <div class="collect">
        <div class="photo" @click="handleCollect">
          <tm-image mode="aspectFit" src="1681367187577_S4jbJZai.png" />
        </div>
        <div @click="handleCollect" v-if="poiOptions.length == clockList.length">
          <div class="text-num">已集齐 {{ poiOptions.length }} 枚文学信物</div>
          <div class="bar">
            <div class="bar-process" style="width: 100%"></div>
          </div>
        </div>
        <div @click="handleCollect" v-else>
          <div class="text-num">已集齐 {{ gainCardNum }} 个信物，还有 {{ goCardNum }} 个信物待解锁</div>
          <div class="bar">
            <div class="bar-process" :style="{ width: `${gainCardPercentage}%` }"></div>
          </div>
        </div>

        <div class="popup center">
          <div class="popup-content">
            <div class="info-text">
              <div>查看我的信物，</div>
              <div>抽取文人气质卡</div>
            </div>
            <div class="btn-step" @click="guideStore.addStep">下一步</div>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>
    </div>

    <div class="guide-wrapper" @click.stop="guideStore.addStep">
      <div class="step1-wrapper">
        <div class="popup">
          <div class="popup-content">
            <div class="title">功能1</div>
            <div class="info-text">跟着宁好，行走文都</div>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>

      <div class="step2-wrapper">
        <div class="popup">
          <tm-image src="1675658482008_2mmR561y.png" />
        </div>
      </div>

      <div class="step4-wrapper">
        <div class="popup center">
          <div class="popup-content">
            <div class="title">功能2</div>
            <div class="info-text">抵达坐标，AR扫一扫来识图</div>
            <div class="btn-step">下一步</div>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>

      <div class="step5-wrapper">
        <div class="popup center">
          <div class="popup-content">
            <div class="title">功能3</div>
            <div class="info-text">点触时空柱，解锁文脉</div>
            <div class="btn-step">下一步</div>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>

      <div class="step6-wrapper">
        <div class="popup center">
          <div class="popup-content">
            <div class="title">功能4</div>
            <div class="info-text">在线预约，探秘文学客厅</div>
            <div class="btn-step" @click.stop="guideStore.finish">开始探索</div>
          </div>
          <div class="popup-arrow"></div>
        </div>
      </div>
    </div>
    <view class="shape" @click.stop="guideStore.addStep"></view>

    <!-- 距离不够错误弹框 -->
    <cover-view class="dialog-clock-fail" v-if="dialogVisibleClockFail" @click="dialogVisibleClockFail = false">
      <cover-view class="dialog-clock-wrapper" @click.stop>
        <cover-image class="close" :src="cdn + '/1688699848467_4kx8Zr98.png'" @click="dialogVisibleClockFail = false"/>
        <cover-view class="dialog-body">
          <cover-view class="title">待解锁信物「{{ clockPoi.keepsake }}」</cover-view>
          <cover-view class="text">需走到点位处，才可以打卡成功哦！</cover-view>
        </cover-view>
        <cover-view class="dialog-footer">
          <cover-view class="btn" @click="handleStudy">去学习</cover-view>
          <cover-view class="btn" :class="{disable: !isMarkerClockRange}" @click="handleCardClock">去打卡</cover-view>
        </cover-view>
      </cover-view>
    </cover-view>

    <!-- 领取信物 -->
    <div class="dialog-clock" v-if="dialogVisibleClock" @click="dialogVisibleClock = false">
      <tm-nav fixed white title="" backgroundColor="rgba(0,0,0,0)">
        <template #icon>
          <view class="img" @click="dialogVisibleClock = false">
            <tm-image :src="cdn + '/icon_back_white.svg'" />
          </view>
        </template>
      </tm-nav>

      <div class="dialog-clock-wrapper" @click.stop>
        <div class="card">
          <div class="keepsake-wrapper">
            <div class="keepsake">
              <tm-image :src="clockPoi.keepsakePhoto" />
            </div>
          </div>
          <div class="keepsake-info">
            <div class="name">
              <div class="style">{{ clockPoi.keepsakeInfo }}</div>
              <div>您已解锁信物「{{ clockPoi.keepsake }}」</div>
            </div>
            <div class="poi">
              <div class="icon">
                <tm-image src="1672133939775_QQP5HGam.svg" />
              </div>
              南京文学客厅·{{ clockPoi.name }}
            </div>
          </div>
        </div>
        <div class="btn-container">
          <cover-view class="btn again" @click="handleSaveClock">保存与分享</cover-view>
          <cover-view class="btn save" @click="handleStudy">去学习</cover-view>
        </div>
      </div>

      <div class="keepsake-nav" @click="navigateTo('KEEPSAKE');triggerReport('main_map_success_progress_click')">
        <tm-image src="1681367187577_S4jbJZai.png" />
      </div>

      <canvas id="canvas" type="2d" style="width: 375px; height: 730px"></canvas>
    </div>

    <!-- 领取领导气质卡 -->
    <div class="dialog-clock-all" v-if="dialogVisibleCardLeader" @click="dialogVisibleCardLeader = false">
      <tm-nav fixed white :title="dialogVisibleCardLeaderGift ? '' : '我的文人气质卡'" backgroundColor="rgba(0,0,0,0)">
        <template #icon>
          <view class="img" @click="dialogVisibleCardLeader = false">
            <tm-image :src="cdn + '/icon_back_white.svg'" />
          </view>
        </template>
      </tm-nav>

      <div class="dialog-clock-all-wrapper" @click.stop v-if="dialogVisibleCardLeaderGift">
        <div class="title">
          <div>恭喜你解锁2个文学信物</div>
          <div>点击抽取我的「文人气质卡」</div>
        </div>
        <div class="gift" @click="handleClockLeader">
          <div class="fireworks">
            <tm-image src="1672042705654_MJYzCkhi.gif" />
          </div>
          <div class="pen">
            <tm-image src="1672040018583_RrmkEk4z.png" />
          </div>
          <div class="hand"></div>
        </div>
      </div>
      <div class="dialog-clock-all-wrapper" @click.stop v-else>
        <div class="card" v-if="cardLevel1">
          <tm-image :src="cardLevel1.card.pic" />
          <div class="name" v-if="cardLevel1.name">{{ cardLevel1.name }} 的文人气质卡</div>
        </div>
        <div class="btn-container">
          <cover-view class="btn save" @click="handleSaveCardLeader" v-if="!dialogVisibleCardLeaderName">保存与分享
          </cover-view>
        </div>
      </div>

      <div class="dialog-receive" @click.stop v-if="dialogVisibleCardLeaderName"
           :style="{ bottom: keyboardHeight + 'px' }">
        <div class="dialog-receive-wrapper">
          <div class="title">请输入我的信息，获得文人气质卡</div>
          <div class="input">
            <div>我的昵称</div>
            <input
              v-model="cardLeaderName"
              focus
              hold-keyboard
              placeholder="请输入"
              :adjust-position="false"
              @focus="triggerKeyboard"
              @blur="triggerKeyboard(0)"
            />
          </div>
        </div>
        <cover- class="dialog-receive-footer">
          <cover-view class="btn back" @click="dialogVisibleCardLeaderName = false">返回</cover-view>
          <cover-view class="btn save" @click="handleSaveLeader">确定</cover-view>
        </cover->
      </div>

      <canvas id="canvasLeader" type="2d" style="width: 375px; height: 730px"></canvas>
    </div>

    <!-- 领取气质卡 -->
    <div class="dialog-clock-all" v-if="dialogVisibleClockAll" @click="dialogVisibleClockAll = false">
      <tm-nav fixed white :title="dialogVisibleGift ? '' : '我的文人气质卡'" backgroundColor="rgba(0,0,0,0)">
        <template #icon>
          <view class="img" @click="dialogVisibleClockAll = false">
            <tm-image :src="cdn + '/icon_back_white.svg'" />
          </view>
        </template>
      </tm-nav>

      <div class="dialog-clock-all-wrapper" @click.stop v-if="dialogVisibleGift">
        <div class="title">
          <div>恭喜你解锁全部文学信物</div>
          <div>点击抽取我的「文人气质卡」</div>
        </div>
        <div class="gift" @click="handleClockAll">
          <div class="fireworks">
            <tm-image src="1672042705654_MJYzCkhi.gif" />
          </div>
          <div class="pen">
            <tm-image src="1672040018583_RrmkEk4z.png" />
          </div>
          <div class="hand"></div>
        </div>
      </div>
      <div class="dialog-clock-all-wrapper" @click.stop v-else>
        <div class="card" v-if="cardLevel2">
          <tm-image :src="cardLevel2.card.pic" />
          <div class="name" v-if="cardLevel2.name">{{ cardLevel2.name }} 的文人气质卡</div>
        </div>
        <div class="btn-container">
          <cover-view class="btn save" v-if="!dialogVisibleReceive" @click="handleSaveClockAll">保存与分享</cover-view>
        </div>
      </div>

      <div class="dialog-receive" @click.stop v-if="dialogVisibleReceive" :style="{ bottom: keyboardHeight + 'px' }">
        <div class="dialog-receive-wrapper">
          <div class="title">请输入我的信息，获得文人气质卡</div>
          <div class="input">
            <div>我的昵称</div>
            <input
              v-model="userName"
              focus
              hold-keyboard
              placeholder="请输入"
              :adjust-position="false"
              @focus="triggerKeyboard"
              @blur="triggerKeyboard(0)"
            />
          </div>
        </div>
        <cover- class="dialog-receive-footer">
          <cover-view class="btn back" @click="dialogVisibleReceive = false">返回</cover-view>
          <cover-view class="btn save" @click="handleSave">确定</cover-view>
        </cover->
      </div>

      <canvas id="canvasAll" type="2d" style="width: 375px; height: 730px"></canvas>
    </div>

    <div class="cache">
      <tm-image src="1672042705654_MJYzCkhi.gif" />
    </div>
  </div>
</template>

<script setup>
import { onHide, onShow } from "@dcloudio/uni-app";
import { minBy, sample, differenceBy, throttle, isArray, sortBy, isNumber } from "lodash";
import { storeToRefs } from "pinia";
import { ref, computed, watch, watchEffect, getCurrentInstance } from "vue";
import { useGuide, useMap } from "@/store";
import { getGuidRouteList } from "@/services/pro/api";
import pathMerge from "./pathMerge";
import { getLocation } from "@/utils/location";
import { getDistance } from "@/utils";
import { init, initCanvas, initMarker } from "@/pages/clock/constants";
import poiOptions from "@/config/poi";
import { PAGE_PATH } from "@/services/jump";
import {
  getClockCardList,
  getGraceCard,
  updateCardCheck,
  updateCardCompose,
  updateGraceCard,
} from "@/services/pro/clock";
import { getUserInfo } from "@/services/info";
import { useGraceCards } from "@/store";

const isMock = import.meta.env.VITE_MOCK_LOCATION === "yes";
const guideStore = useGuide();
const { step, isGuide } = storeToRefs(guideStore);

// 获取地图默认经纬度
const { getMapStyle } = storeToRefs(useMap());

/** 更新获取气质卡列表 */
const graceCards = ref([]); // 领取的气质卡
onShow(() => getGraceCardInfo());
// 拉取气质卡列表
const getGraceCardInfo = async () => {
  const { openid } = await getUserInfo();
  const result = await getGraceCard({ open_id: openid });
  if (isArray(result)) graceCards.value = sortBy(result, "card.serial_no");
};

/** 获取打卡列表 */
const cardList = ref([]);
const clockList = ref([]);
onShow(() => updateClockList());
// 更新打卡列表
const updateClockList = async () => {
  const { openid } = await getUserInfo();
  const { card_list } = await getClockCardList({ scenic_id: config.sid, open_id: openid });
  cardList.value = card_list;
  clockList.value = card_list.filter((row) => row.is_check);
};

/** 新手引导 */
const stepClass = computed(() => {
  // 等待打卡信息更新完毕
  if (cardList.value.length === 0) return [];

  if (step.value > 0 && step.value < 7) return ["guide", `step${step.value}`];
  return [];
});
watch(cardList, async (to) => {
  if (isGuide.value || to.length === 0 || clockList.value.length) return;
  await getLocation();
  guideStore.start();
});

/** map、marker、polylines */
const pois = ref([]);
const markers = ref();
const markerCurrent = ref(); // 选中的marker（选中marker需要改变marker图标）
const polylines = ref([]);
const isMarkerClockRange = ref(false); // 是否进入当前选中marker的打卡范围
const internalInstance = getCurrentInstance();
onShow(async () => {
  if (pois.value.length) return;
  const res = await getGuidRouteList({
    scenic_id: config.sid,
  });
  if (!res) return;
  // 选中的路线信息
  const path = res[0];
  if (!path) return;
  pois.value = path.spot_list;
  // 生成路线
  const points = pathMerge(path.road_point);
  polylines.value = points.map((point) => ({
    points: point,
    color: "#289C8D",
    width: 6,
    borderColor: "#fff",
    borderWidth: 1,
  }));
  markerCurrent.value = minBy(pois.value, "distance");
  // 生成marker
  markers.value = initMarker(pois.value, markerCurrent.value.spot_id, clockList.value);
});
// 缩放地图视野
const handleRegionChange = (event) => {
  internalInstance.data.mapCtx.getScale({
    success: ({ scale }) => {
      if (scale) {
        markers.value = initMarker(pois.value, markerCurrent.value?.spot_id, clockList.value, scale);
      }
    },
  });
  internalInstance.data?.regionRange?.(event);
};
watch(
  markerCurrent,
  (to) => {
    markers.value = initMarker(pois.value, to?.spot_id, clockList.value, internalInstance.data?.scale);
  },
  { deep: true },
);
// 打卡后更新markerCurrent(若用户打卡成功，回到地图页：在离用户最近、未打卡成功的点位处，替换展示「去打卡」marker)
watchEffect(async () => {
  if (!pois.value.length || !clockList.value.length) return;
  let unClockList = differenceBy(pois.value, clockList.value, "spot_id");
  if (unClockList.length) {
    const location = await getLocation();
    unClockList = unClockList.map((row) => {
      return {
        ...row,
        distance: getDistance(row.point, location),
      };
    });
    markerCurrent.value = minBy(unClockList, "distance");
  } else {
    markerCurrent.value = undefined;
  }
});

/** 打卡点位获取信物 */
const clockPoi = ref(null); // 解锁的信物信息
let dialogVisibleClock = ref(false);
const dialogVisibleClockFail = ref(false);
const handleClock = async (marker) => {
  const { markerId } = marker.detail;

  if (dialogVisibleClock.value || dialogVisibleClockFail.value) return;

  clockPoi.value = poiOptions.find((poi) => markerId === poi.id);

  // 已解锁marker直接进入详情页
  if (clockList.value.find((row) => Number(row.spot_id) === markerId)) {
    wx.reportEvent("main_map_marker1_click");
    dialogVisibleClock.value = true;
    return;
  }


  // 切换去打卡marker
  if (markerId !== Number(markerCurrent.value.spot_id)) {
    wx.reportEvent("main_map_marker1_click");
    dialogVisibleClockFail.value = true;
    markerCurrent.value = pois.value.find((row) => Number(row.spot_id) === markerId);
    const location = await getLocation();
    const poi = pois.value.find((poi) => markerId === Number(poi.spot_id));
    isMarkerClockRange.value = getDistance(location, poi.point) < import.meta.env.VITE_CLOCK_DISTANCE;
    return;
  }

  const location = await getLocation();
  const poi = pois.value.find((poi) => markerId === Number(poi.spot_id));
  const isRange = getDistance(location, poi.point) < import.meta.env.VITE_CLOCK_DISTANCE;

  // 点击去打卡marker事件
  wx.reportEvent("main_map_marker2_click");
  console.log(getDistance(location, poi.point), import.meta.env.VITE_CLOCK_DISTANCE, location);
  if (isRange) {
    // 解锁信物
    const { openid } = await getUserInfo();
    await updateCardCheck({ open_id: openid, scenic_id: config.sid, spot_id: String(markerId) });
    dialogVisibleClock.value = true;
    await updateClockList();
    wx.showToast({ title: "打卡成功!", icon: "none" });
    wx.reportEvent("main_map_success_show", { spot_id: markerId });
  } else {
    dialogVisibleClockFail.value = true;
  }
  isMarkerClockRange.value = isRange;
};
const handleCardClock = async () => {
  const poi = markerCurrent.value;
  if (!isMarkerClockRange.value || !poi) return;
  const location = await getLocation();
  const isRange = getDistance(location, poi.point) < import.meta.env.VITE_CLOCK_DISTANCE;

  if (!isRange) return;

  const { openid } = await getUserInfo();
  await updateCardCheck({ open_id: openid, scenic_id: config.sid, spot_id: String(poi.spot_id) });
  dialogVisibleClock.value = true;
  await updateClockList();
  wx.showToast({ title: "打卡成功!", icon: "none" });
  dialogVisibleClockFail.value = false;
}
const handleStudy = () => {
  wx.reportEvent("main_map_success_study_click");
  wx.navigateTo({ url: `${PAGE_PATH.GUIDE_POI_DETAIL}?id=${clockPoi.value.id}` });
};
const handleSaveClock = async () => {
  wx.reportEvent("main_map_success_share_click");
  wx.showLoading({ title: "图片生成中..." });
  try {
    const canvas = await init(clockPoi.value);
    // 生成图片
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        wx.hideLoading();
        console.log(res.tempFilePath);
        // 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath,
          success: () => {
            wx.showToast({ title: "操作成功", icon: "none" });
          },
          fail() {
            wx.showToast({ title: "操作失败", icon: "none" });
          },
        });
      },
    });
  } catch (e) {
    wx.showToast({ title: "图片生成失败", icon: "none" });
  }
};
onHide(() => {
  setTimeout(() => {
    clockPoi.value = null;
    dialogVisibleClock.value = false;
    dialogVisibleClockFail.value = false;
  });
});

/************************打卡2个点位解锁领导气质卡**************************/
const { graceCardsTypeOne } = storeToRefs(useGraceCards()); // 获取气质卡列表
const cardLevel1 = computed(() => {
  const index = graceCards.value.findIndex((row) => row.card?.serial_no === 1);
  if (index === -1) return null;
  return {
    index,
    ...graceCards.value[index],
  };
});
let dialogVisibleCardLeader = ref(false);
const dialogVisibleCardLeaderGift = ref(true); // 点击竹签框
const dialogVisibleCardLeaderName = ref(false); // 领取气质卡，昵称输入框
const cardLeaderName = ref();
// 保存图片
const saveImageLevel1 = async () => {
  wx.showLoading({ title: "图片生成中..." });
  try {
    const canvas = await initCanvas(cardLevel1.value?.name || cardLeaderName.value, cardLevel1.value.card, "#canvasLeader");
    // 生成图片
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        wx.hideLoading();
        // 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath,
          success: (res) => {
            console.log("showShareImageMenu", res);
            wx.showToast({ title: "操作成功", icon: "none" });
          },
          fail(res) {
            console.log("showShareImageMenu", res);
            wx.showToast({ title: "操作失败", icon: "none" });
          },
          complete() {
            getGraceCardInfo();
          },
        });
      },
    });
  } catch (e) {
    console.log(e);
    wx.showToast({ title: "图片生成失败", icon: "none" });
  }
};
const handleSaveCardLeader = throttle(
  () => {
    if (cardLevel1.value.status === 2) {
      saveImageLevel1();
      return;
    }
    dialogVisibleCardLeaderName.value = true;
  },
  2000,
  { trailing: false },
);
// 解锁气质卡
const handleClockLeader = throttle(
  async () => {
    const { openid } = await getUserInfo();
    try {
      await updateCardCompose({ scenic_id: config.sid, open_id: openid, card_id: sample(graceCardsTypeOne.value).id });
      await getGraceCardInfo();
      dialogVisibleCardLeaderGift.value = false;
    } catch {
      await getGraceCardInfo();
      await updateClockList();
    }
  },
  2000,
  { trailing: false },
);
// 领取气质卡
const handleSaveLeader = async () => {
  if (!cardLeaderName.value) {
    wx.showToast({ title: "请输入昵称", icon: "none" });
    return;
  }
  if (cardLeaderName.value?.length > 10) {
    wx.showToast({ title: "名称长度超出限制", icon: "none" });
    return;
  }

  const { openid } = await getUserInfo();
  await updateGraceCard({
    name: cardLeaderName.value,
    open_id: openid,
    card_id: cardLevel1.value.card.id,
    scenic_id: config.sid,
    no: cardLevel1.value.no,
  });
  await getGraceCardInfo();

  dialogVisibleCardLeaderName.value = false;

  await saveImageLevel1();
};
setTimeout(() => {
  // 解锁列表更新，并解锁所有珍宝
  watchEffect(() => {
    if (
      dialogVisibleClock.value ||
      clockList.value.length < 2 ||
      (isNumber(cardLevel1.value?.status) && cardLevel1.value.status >= 1 && dialogVisibleCardLeaderGift.value)
    ) {
      dialogVisibleCardLeader.value = false;
      return;
    }
    dialogVisibleCardLeader.value = true;
  });
}, 2000);
// 关闭气质卡领取框，重置状态
watch(dialogVisibleCardLeader, (to) => {
  if (!to) dialogVisibleCardLeaderGift.value = true;
});
/************************end******************************/

/** 打卡完所有点位， level2气质卡生成、保存 */
const { graceCardsTypeTwo } = storeToRefs(useGraceCards()); // 获取气质卡列表
const cardLevel2 = computed(() => {
  const index = graceCards.value.findIndex((row) => row.card.serial_no === 2);
  if (index === -1) return null;
  return {
    index,
    ...graceCards.value[index],
  };
});
let dialogVisibleClockAll = ref(false);
const dialogVisibleGift = ref(true); // 点击竹签框
const dialogVisibleReceive = ref(false); // 领取气质卡，昵称输入框
const userName = ref(); // input bind
// 保存图片
const saveImageLevel2 = async () => {
  wx.showLoading({ title: "图片生成中..." });
  try {
    const canvas = await initCanvas(cardLevel2.value?.name || userName.value, cardLevel2.value.card);
    // 生成图片
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        wx.hideLoading();
        // 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath,
          success: (res) => {
            console.log("showShareImageMenu", res);
            wx.showToast({ title: "操作成功", icon: "none" });
          },
          fail(res) {
            console.log("showShareImageMenu", res);
            wx.showToast({ title: "操作失败", icon: "none" });
          },
          complete() {
            getGraceCardInfo();
          },
        });
      },
    });
  } catch (e) {
    console.log(e);
    wx.showToast({ title: "图片生成失败", icon: "none" });
  }
};
const handleSaveClockAll = throttle(
  () => {
    if (cardLevel2.value.status === 2) {
      saveImageLevel2();
      return;
    }
    // 获取之前填写过的name
    if (cardLevel1.value.name) {
      userName.value = cardLevel1.value.name;
      handleSave();
      return;
    }
    // 显示名称输入领取框
    dialogVisibleReceive.value = true;
  },
  2000,
  { trailing: false },
);
// 解锁气质卡
const handleClockAll = throttle(
  async () => {
    const { openid } = await getUserInfo();
    try {
      await updateCardCompose({ scenic_id: config.sid, open_id: openid, card_id: sample(graceCardsTypeTwo.value).id });
      await getGraceCardInfo();
      dialogVisibleGift.value = false;
    } catch {
      await getGraceCardInfo();
      await updateClockList();
    }
  },
  2000,
  { trailing: false },
);
// 领取气质卡
const handleSave = async () => {
  if (!userName.value) {
    wx.showToast({ title: "请输入昵称", icon: "none" });
    return;
  }
  if (userName.value?.length > 10) {
    wx.showToast({ title: "名称长度超出限制", icon: "none" });
    return;
  }

  const { openid } = await getUserInfo();
  await updateGraceCard({
    name: userName.value,
    open_id: openid,
    card_id: cardLevel2.value.card.id,
    scenic_id: config.sid,
    no: cardLevel2.value.no,
  });
  await getGraceCardInfo();

  dialogVisibleReceive.value = false;

  await saveImageLevel2();
};
// 延迟2秒待接口请求完成
setTimeout(() => {
  // 解锁列表更新，并解锁所有珍宝
  watchEffect(() => {
    if (
      dialogVisibleCardLeader.value ||
      dialogVisibleClock.value ||
      clockList.value.length !== poiOptions.length ||
      (isNumber(cardLevel2.value?.status) && cardLevel2.value.status >= 1 && dialogVisibleGift.value)
    ) {
      dialogVisibleClockAll.value = false;
      return;
    }
    dialogVisibleClockAll.value = true;
  });
}, 2000);
// 关闭气质卡领取框，重置状态
watch(dialogVisibleClockAll, (to) => {
  if (!to) dialogVisibleGift.value = true;
});

// 点击我的信物
const handleCollect = () => {
  wx.reportEvent("main_map_progress_click");
  wx.navigateTo({ url: PAGE_PATH["KEEPSAKE"] });
};

// 文学信物收集进度
// 已解锁数量
const gainCardNum = computed(() => clockList.value.length);
// 待解锁数量
const goCardNum = computed(() => poiOptions.length - gainCardNum.value);
// 已解锁占百分比
const gainCardPercentage = computed(() => {
  return (gainCardNum.value / poiOptions.length) * 100;
});

/** 输入昵称，获取键盘高度 */
const keyboardHeight = ref(0);
const triggerKeyboard = (e) => {
  if (typeof e === "number") {
    keyboardHeight.value = e;
    return;
  }
  keyboardHeight.value = e.detail.height;
};

// 数据埋点
const triggerReport = (name) => {
  wx.reportEvent(name);
};
</script>
<script>
import hookMap from "@/hooks/map";
import { getLocation } from "@/utils/location";
import config from "@/config";
import { PAGE_PATH, toUrl } from "@/services/jump";

export default {
  data() {
    return {
      mapCtx: null,
      scale: 17,
      regionRange: () => {
      },
    };
  },
  onShow() {
    this.$scope.getTabBar()
      .setData({
        selected: 0,
      });
  },
  mounted() {
    this.mapCtx = wx.createMapContext("mapContext", this);
    this.regionRange = hookMap(this.mapCtx);
  },
  onShareAppMessage() {
    const { image, title } = config.shares;
    return {
      title,
      imageUrl: image,
    };
  },
  onShareTimeline() {
    const { image, title } = config.shares;
    return {
      title,
      imageUrl: image,
    };
  },
  methods: {
    // 定位
    async handleLocation() {
      const isScope = await this.handleCheckInsideScenicAsync();
      if (isScope === true) {
        const res = await getLocation();
        this.mapCtx.moveToLocation(res);
      }
    },
  },
};
</script>

<style src="./index.scss" lang="scss"></style>
