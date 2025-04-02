<template>
  <tm-nav title="" back />
  <article class="search">
    <view class="search-box">
      <view class="input">
        <tm-icon type="search" />
        <input
          v-model="search.info"
          focus
          type="text"
          placeholder="查找地点"
          @input="getPoiSearch"
        />
        <tm-icon v-if="search.info" size="32" color="#a9a9a9" type="solid-off" @tap="search.info = ''" />
      </view>
      <text @click="onCancel">取消</text>
    </view>
    <view class="search-content">
      <view v-if="search.info" class="asso">
        <scroll-view
          v-if="search.list.length"
          style="height: calc(100vh - 45px); padding-bottom: env(safe-area-inset-bottom)"
          scroll-y="true"
        >
          <view v-for="(item, i) in search.list" :key="i" class="item" @click="handleSearchRes(item)">
            <tm-icon :type="item.icon_name" size="38" :color="themeConfig.default" />
            <view class="limit">{{ item.name }}</view>
            <text>{{ item.distancer }}</text>
          </view>
        </scroll-view>
        <tm-status
          :value="!loading && !search.list.length"
          type="data"
          image-size="200"
          desc="未找到相关地点"
        />
      </view>
      <view v-else class="hot-search">
        <h3 v-if="recommendList.length">热门搜索</h3>
        <view class="hots">
          <view
            v-for="(item, index) in recommendList"
            :key="index"
            class="item"
            @click="getPoiSearch({ type: 'recommend', value: item.name })"
          >
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
  </article>
</template>

<script>
/*
 * @fileoverview | 景点搜索页
 * @version 0.2 | 2021-10-12 10:18:40
 * @Last Modified by: mikey.leo
 * @Last Modified time: 2021-11-16 16:59:24
 */
import debounce from 'lodash/debounce';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
import { PAGE_PATH, navigateTo } from '@/services/jump';
import { getHotSearch, searchByName, reportSearch } from '@/services/pro/api';
import config from '@/config';
import { getThemeConfig, getSid, getScenicInfo } from '@/services/info';

export default {
  data() {
    return {
      // 搜索联想
      search: {
        info: '', // 搜索关键词
        list: [], // 搜索结果列表
        empty_status: config.images.empty_status,
      },
      // 热门搜索
      recommendList: [],
      loading: true,
      themeConfig: {},
    };
  },
  onLoad() {
    this.init();
  },
  methods: {
    onCancel() {
      wx.navigateBack({ delta: 1 });
    },
    async init() {
      this.themeConfig = await getThemeConfig();
      const sid = await getSid();
      const info = await getScenicInfo(sid);
      // 获取热门搜索
      this.recommendList = await getHotSearch({
        scenic_id: info.id,
      });
    },
    getPoiSearch: debounce(function callback(e) {
      let word;
      if (typeof e === 'object') {
        if (e.type === 'recommend') {
          word = e.value;
          this.search.info = word;
        } else {
          word = e.detail.value;
        }
        this.getSearchData(word);
      }
    }, 500),
    async getSearchData(word) {
      if (!word.trim()) {
        return;
      }
      this.loading = true;
      const sid = await getSid();
      const info = await getScenicInfo(sid);
      const { id: scenicid, tags } = info;
      const tagMap = keyBy(tags, 'tag');
      console.log('ggggg', tagMap);
      const res = await searchByName({
        id: scenicid,
        name: word.trim(),
        field: ['basic', 'pic', 'speech', 'park_area'],
        pn: 1,
        rn: 100,
      });
      this.search.list = res.map(item => ({
        ...item,
        icon_name: get(tagMap[item.category], 'icon_name', ''),
      })).filter(row => row.icon_name);
      this.loading = false;
    },
    async handleSearchRes(item) {
      const sid = await getSid();
      // 上报关键词
      await reportSearch({
        spot_id: item.spot_id,
        scenic_id: sid,
      });
      navigateTo(
        PAGE_PATH.GUIDE,
        {
          spot_id: item.spot_id,
          sid,
        },
        false,
        true,
      );
    },
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
