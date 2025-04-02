<template>
  <view
    :class="[
      prefixCls,
      `${prefixCls}-${type}`,
      `${prefixCls}-${shape}`,
      size ? `${prefixCls}-${size}` : '',
      plain ? `${prefixCls}-${plain}` : '',
      maxWidth ? `${prefixCls}-slug` : ''
    ]"
    :style="[ tagStyle ]"
    @tap="handleClick"
  >
    <slot/>
  </view>
</template>
<script>
/*
 * Copyright (c) 2020-Now Tencent. All rights reseved.
 * @fileoverview | tag小标签
 * @Author: mukuashi | kuashimu@tencent.com
 * @version 0.1 | 2020-07-13 // Initial version.
 * @Date: 2020-07-13 14:21:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-26 11:25:24
 */
import app from '@/config';

export default {
  name: 'TmTag',
  props: {
    type: {
      type: String,
      default: 'default', // ['default', 'primary', 'error', 'success', 'warning', 'grey']
    },
    // 用户自定义color会覆盖默认主题type
    color: String,
    bgColor: String,
     // 长宽单位均为rpx
    width: [String, Number],
    height: [String, Number],
    // small,large
    size: [Number, String],
    fontSize: [Number, String],
    // 按钮文字是否加粗
    weight: [Boolean, Number, String],
    // circle, square
    shape: {
      type: String,
      default: 'fillet', // ['circle', 'square', 'fillet']
    },
    // 是否空心
    plain: {
      type: Boolean,
      default: false,
    },
    // 超多最大宽度的文本自动省略号(默认单位rpx)
    maxWidth: {
      type: [Boolean, String, Number],
      default: false,
    },
    // 更多自定义style
    customStyle: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      prefixCls: `${app.prefix}-tag`,
    };
  },
  computed: {
    tagStyle() {
      const style = {};
      if (this.color) style.color = this.color;
      if (this.bgColor) style.backgroundColor = this.bgColor;
      if (this.width) style.width = `${this.width}rpx`;
      if (this.height) style.height = `${this.height}rpx`;
      if (this.weight) style.fontWeight = typeof this.weight === 'boolean' ? 600 : this.weight;
      if (this.fontSize) style.fontSize = `${this.fontSize}rpx`;
      if (this.maxWidth && typeof this.maxWidth !== 'boolean') style.maxWidth = `${this.maxWidth}rpx`;
      return { ...style, ...this.customStyle };
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
