<template>
  <view class="image" :style="style">
    <image class="img" :src="url" :mode="mode" />
  </view>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'aspectFill',
  },
  size: {
    type: String,
    default: '',
  },
});

// 设置图片尺寸
const { size } = toRefs(props);
const style = computed(() => {
  if (size.value) return { width: size.value, height: size.value };
  return {};
});

const { src, mode } = toRefs(props);
const CDN = import.meta.env.VITE_ICON_CDN;
const url = computed(() => {
  if (/^http/.test(src.value)) return src.value;
  if (/.png$/.test(src.value)) return `${CDN}/${src.value}`;
  return `${CDN}/${src.value}`;
});
</script>

<style scoped lang="scss">
.image{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
