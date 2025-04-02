<template>
  <div>
    <tm-nav back fixed title="文学信物图鉴" backgroundColor="rgba(0,0,0,0)" />

    <div class="content">
      <div class="keepsake">
        <div class="keepsake-wrapper">
          <div
            class="keepsake-item"
            :class="{ clock: poi.clock }"
            v-for="poi in keepsakeList"
            :key="poi.key"
            @click="handleKeepsakeItem(poi)"
          >
            <div class="photo">
              <tm-image :src="poi.keepsakePhoto" />
            </div>
            <div class="text">
              <tm-image src="1675934177559_bQfCfYDZ.svg" />
            </div>
          </div>
        </div>
        <div class="progress">
          <div class="photo" @click="handlePlayInfo">
            <tm-image src="1676023831200_dNjBcGTj.png" />
          </div>
          <div>
            <div class="info" v-if="poiOptions.length == clockList.length">
              <div>已集齐 {{ poiOptions.length }} 枚文学信物</div>
            </div>
            <div class="info" v-else>
              <div>已集齐 {{ gainCardNum }} 个信物，还有 {{goCardNum}} 个信物待解锁</div>
            </div>
            <div class="bar">
              <div class="bar-value" :style="{ width: `${gainCardPercentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="btn" @click="handleFooterBtn">查看文人气质卡</div>
    </div>

    <div class="dialog-clock-fail" v-if="dialogVisibleClockFail" @click="dialogVisibleClockFail = false">
      <div class="dialog-clock-wrapper" @click.stop>
        <div class="dialog-close" @click="dialogVisibleClockFail = false">
          <tm-image src="1676013747034_mkY1JZwC.svg" />
        </div>
        <div class="dialog-body">
          <div class="title">暂未获得文人气质卡</div>
          <div class="text">收集2个信物即可解锁我的文人气质卡</div>
        </div>
        <div class="dialog-footer">
          <div class="btn" @click="dialogVisibleClockFail = false">我知道了</div>
        </div>
      </div>
    </div>

    <div class="dialog-toast" v-if="toastVisible">
      <div class="wrapper">
        <div>读万卷书，行万里路</div>
        <div>前往文学点位打卡后才能解锁信物哦~</div>
      </div>
    </div>

    <div class="source">
      <div class="bottom">
        <tm-image src="1673347584655_ThaJMjSZ.png" />
      </div>
      <div class="top">
        <tm-image src="1673347892026_fr2mWzzK.png" mode="widthFix" />
      </div>
      <div class="yun">
        <tm-image src="1673349111747_1yPFrB1E.png" mode="widthFix" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { fill } from 'lodash';
import { onMounted, ref, computed } from 'vue';
import poiOptions from '@/config/poi';
import { getUserInfo } from '@/services/info';
import { getClockCardList } from '@/services/pro/clock';
import config from '@/config';
import { PAGE_PATH } from '@/services/jump';
import playInfo from './text';

// 数据埋点
onMounted(() => {
  wx.reportEvent('mygift_show');
});

// 获取打卡列表
const keepsakeList = ref(fill(Array(poiOptions.length), {}));
const clockList = ref([]);
const isLockAll = ref(false); // 是否解锁气质卡
onMounted(() => updateClockList());
// 更新打卡列表
const updateClockList = async () => {
  const { openid } = await getUserInfo();
  const { card_list, unlock } = await getClockCardList({ scenic_id: config.sid, open_id: openid });
  clockList.value = card_list.filter((row) => row.is_check);
  isLockAll.value = unlock;
  keepsakeList.value = poiOptions.map((row) => ({
    ...row,
    clock: !!clockList.value.find((item) => Number(item.spot_id) === row.id),
  }));
};

// 点击信物
const toastVisible = ref(false);
const handleKeepsakeItem = (poi) => {
  if (poi.clock) {
    wx.navigateTo({ url: `${PAGE_PATH.CLOCK_DETAIL}?id=${poi.id}` });
    return;
  }
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 2000);
};

// 查看人文气质卡按钮
const dialogVisibleClockFail = ref(false);
const handleFooterBtn = () => {
  if (clockList.value.length < 2) {
    dialogVisibleClockFail.value = true;
    return;
  }
  wx.navigateTo({ url: PAGE_PATH['GRACE_CARD'] });
};

// 玩法介绍
const handlePlayInfo = () => {
  wx.navigateTo({ url: PAGE_PATH['PLAY_INFO'] });
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
</script>

<style lang="scss" src="./index.scss"></style>
