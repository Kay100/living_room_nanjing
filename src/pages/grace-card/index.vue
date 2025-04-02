<template>
  <div class="">
    <tm-nav back fixed title="我的气质卡" backgroundColor="rgba(0,0,0,0)" />

    <div class="dialog-clock-all">
      <swiper
        class="swiper"
        previous-margin="60rpx"
        next-margin="60rpx"
        :current="swiperCurrent"
        @change="handleSwiperChange"
        v-if="loading"
      >
        <swiper-item class="swiper-item" v-for="(item, index) in swiperItems" :key="index">
          <div class="swiper-item-wrapper" :class="{ scale: index !== swiperCurrent }">
            <div class="item-header">{{ index === 1 ? '笃行版' : '敏学版' }}</div>
            <div class="dialog-clock-all-wrapper" v-if="item.status !== 0">
              <div class="card">
                <tm-image :src="item.card.pic" />
                <div class="name" v-if="item.name">{{ item.name }} 的文人气质卡</div>
              </div>
              <div class="btn-container">
                <div class="btn save" @click="handleSaveClockAll">保存与分享</div>
              </div>
            </div>
            <div class="dialog-clock-no" v-else>
              <div class="wrapper">
                <div>
                  <div class="text-info">
                    <div>尚未获得这张文人气质卡，</div>
                    <div>解锁全部 {{ item.clockNum }} 个信物后即可获得</div>
                  </div>
                  <div class="btn" @click="switchTabTo('HOME')">去获得</div>
                </div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <div class="dialog-receive" v-if="dialogVisibleReceive" :style="{ bottom: keyboardHeight + 'px' }">
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
              @keyboardheightchange="triggerKeyboard"
              @blur="triggerKeyboard(0)"
            />
          </div>
        </div>
        <div class="dialog-receive-footer">
          <div class="btn back" @click="dialogVisibleReceive = false">返回</div>
          <div class="btn save" @click="handleSave">确定</div>
        </div>
      </div>
    </div>

    <div class="source">
      <div class="bottom">
        <tm-image src="1673347584655_ThaJMjSZ.png" />
      </div>
      <div class="top">
        <tm-image src="1673347892026_fr2mWzzK.png" mode="widthFix" />
      </div>
    </div>

    <canvas id="canvasAll" type="2d" style="width: 375px; height: 730px"></canvas>
  </div>
</template>

<script setup>
// 打卡完所有点位， 领取气质卡
import { computed, onMounted, ref, watch } from 'vue';
import { isArray, throttle, sortBy } from 'lodash';
import { initCanvas } from '@/pages/clock/constants';
import { getUserInfo } from '@/services/info';
import { getGraceCard, updateCardCompose, updateGraceCard } from '@/services/pro/clock';
import config from '@/config';
import poiOptions from '@/config/poi';

// 更新获取气质卡列表
const loading = ref(false);
const graceCards = ref([]); // 领取的气质卡
onMounted(() => getGraceCardInfo());
// 拉取气质卡列表
const getGraceCardInfo = async () => {
  const { openid } = await getUserInfo();
  const result = await getGraceCard({ open_id: openid });
  if (isArray(result)) graceCards.value = sortBy(result, 'card.serial_no');

  loading.value = true;
};

// swiper
const swiperCurrent = ref(0);
const handleSwiperChange = (e) => {
  swiperCurrent.value = e.detail.current;
};

// 打卡完所有点位， level2气质卡生成、保存
const cardLevel1 = computed(() => {
  const index = graceCards.value.findIndex((row) => row.card.serial_no === 1);
  if (index === -1) {
    return {
      clockNum: 2,
      status: 0,
    };
  }
  return {
    index,
    ...graceCards.value[index],
  };
});
const cardLevel2 = computed(() => {
  const index = graceCards.value.findIndex((row) => row.card.serial_no === 2);
  if (index === -1) {
    return {
      clockNum: poiOptions.length,
      status: 0,
    };
  }
  return {
    index,
    ...graceCards.value[index],
  };
});
const swiperItems = computed(() => [cardLevel1.value, cardLevel2.value]);
const swiperCurrentCard = computed(() => swiperItems.value[swiperCurrent.value]); // swiper切换更新对应的气质卡
const dialogVisibleReceive = ref(false); // 领取气质卡，昵称输入框
const userName = ref(); // input bind
// 保存图片
const saveImage = async () => {
  wx.showLoading({ title: '图片生成中...' });
  try {
    const canvas = await initCanvas(swiperCurrentCard.value?.name || userName.value, swiperCurrentCard.value.card);
    // 生成图片
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        wx.hideLoading();
        // 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载
        wx.showShareImageMenu({
          path: res.tempFilePath,
          success: (res) => {
            console.log('showShareImageMenu', res);
            wx.showToast({ title: '操作成功', icon: 'none' });
          },
          fail(res) {
            console.log('showShareImageMenu', res);
            wx.showToast({ title: '操作失败', icon: 'none' });
          },
        });
      },
    });
  } catch (e) {
    console.log(e);
    wx.showToast({ title: '图片生成失败', icon: 'none' });
  }
};
const handleSaveClockAll = throttle(
  () => {
    if (swiperCurrentCard.value.status === 2) {
      saveImage();
      return;
    }
    // 获取之前填写过的name
    const result = swiperItems.value.find(row => row.name);
    if (result) {
      userName.value = result.name;
      handleSave();
      return;
    }
    // 显示名称输入领取框
    dialogVisibleReceive.value = true;
  },
  2000,
  { trailing: false },
);
// 领取气质卡
const handleSave = async () => {
  if (!userName.value) {
    wx.showToast({ title: '请输入昵称', icon: 'none' });
    return;
  }
  if (userName.value?.length > 10) {
    wx.showToast({ title: '名称长度超出限制', icon: 'none' });
    return;
  }

  const { openid } = await getUserInfo();

  // 未解锁
  if (swiperCurrentCard.value.status !== 1) {
    await updateCardCompose({
      scenic_id: config.sid,
      open_id: openid,
      card_id: swiperCurrentCard.value.card.id,
    });
    await getGraceCardInfo();
  }

  await updateGraceCard({
    name: userName.value,
    open_id: openid,
    card_id: swiperCurrentCard.value.card.id,
    scenic_id: config.sid,
    no: swiperCurrentCard.value.no,
  });
  await getGraceCardInfo();
  dialogVisibleReceive.value = false;

  await saveImage();
};
// swiper切换关闭领取框
watch(swiperCurrent, () => {
  dialogVisibleReceive.value = false;
  userName.value = '';
});

// 输入昵称，获取键盘高度
const keyboardHeight = ref(0);
const triggerKeyboard = (e) => {
  if (typeof e === 'number') {
    keyboardHeight.value = e;
    return;
  }
  keyboardHeight.value = e.detail.height;
};
</script>

<style lang="scss" src="./index.scss"></style>
