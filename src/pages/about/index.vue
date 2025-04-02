<template>
	<tm-nav title="关于文都" fixed back :backgroundColor="`rgba(255,255,255,${opacity})`" :white="opacity < 0.5"/>
  <header class="header">
    <img class="img" :src="cdn + '/1676615523052_9PhY1YwT.jpg'" mode="widthFix" />
  </header>

  <main class="content">
    <div class="title">文都 · 南京</div>
    <div class="text"><tm-text :text="textInfo"/></div>
    <div class="video">
      <tm-video src="https://incos-1251316161.cos.ap-nanjing.myqcloud.com/cloud/living_room_nanjing/3.%E6%96%87%E5%AD%A6%E4%B9%8B%E9%83%BD%E7%94%B3%E9%83%BD%E5%AE%A3%E4%BC%A0%E7%89%87.mp4" />
    </div>
    <div class="title">鸡笼山 · 世界文学客厅</div>
    <div class="text"><tm-text :text="textPoi"/></div>
    <div>
      <img class="img" :src="cdn + '/1675065932171_iK96BkBD.jpeg'" mode="widthFix" />
    </div>
    <div class="title">文学坐标：</div>
    <div class="text"><tm-text :text="text"/></div>
    <div>
      <img class="img" :src="cdn + '/1675066267604_bxWMKwpt.jpeg'" mode="widthFix" />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';

const textInfo = `2019年10月31日，南京入选联合国教科文组织“创意城市网络”，成为中国首个世界“文学之都”。
      南京磅礴悠久的历史离不开文学，其优渥的文学资源不仅体现在书简纸张的诗文篇章之中，更蕴藏于山川河流、市井街巷和宫阙城池的遗迹之中，文学不仅丰富了南京城的历史，也滋养着南京人的生活。`;
const textPoi = `鸡笼山为钟山余脉，东连覆舟山、西接鼓楼冈、北滨玄武湖。
       公元439年，南朝宋文帝在此设立中国历史上第一座文学馆，文学作为一门独立学科由此诞生。齐武帝永明年间，竟陵王萧子良开西邸，形成“竟陵八友”文学集团。梁昭明太子萧统玄圃汇聚刘勰等文士，编成现存最早中国文学总集《文选》。明太祖朱元璋建国子监于山麓，改山名为鸡鸣山……古往今来，鸡笼山麓文人荟萃、佳作迭出。
      2021年，根据南京文学之都空间建设的要求，在这里建设世界文学客厅，以开放博物馆的理念，用文学小道串联文学馆、文学公园、文学山，用数字技术连接历史文脉和空间场所，让城市与山林交汇，文学与空间融合，成为文学之都空间建设的文学城市客厅、文学数据中心、文学空间枢纽和文学梦想殿堂。`;
const textRange = `该区域游览范围东至和平公园（西园），西至民间石器园，北至解放门，南至北京东路，区域面积约61公顷
`;
const text = `入口：和平公园（西门）

第一站：华林园
华林园始建于东吴，是延续六朝的皇家园林。中国第一座文学馆、西邸文学集团、昭明太子玄圃、明国子监等皆在此处，千百年来，文人云集，文风繁盛。

第二站：文学馆旧址
公元439年，南朝宋文帝命谢元在鸡笼山下建立了中国首个文学馆，自此文学成为一门独立学科。

第三站：十竹斋旧址
明朝出版家胡正言在鸡笼山麓建书房“十竹斋”，刊印《十竹斋书画谱》和《十竹斋笺谱》，其彩色套版印刷技术领先于世界。

第四站：西邸文学集团
南朝齐永明年间，西邸文学集团形成，谢朓、沈约、萧衍等“竟陵八友”经常在鸡笼山麓游集宴饮、诗歌唱和，他们在文学创作和理论研究上均有重要成就。

第五站：半山石景园
公元501年，南朝文学理论家刘勰于南京创作《文心雕龙》，这是中国首部体系严密的文学理论专著。

第六站：文选亭
公元531年，南梁昭明太子萧统于玄武湖主持编撰《昭明文选》，这是中国现存最早汉族文学总集。

第七站：文思亭
唐宋时期，张九龄、李白、李商隐、李煜、王安石等诗人，徜徉于鸡笼山麓、玄武湖畔，留下众多脍炙人口的千古名篇。

第八站：文远亭
明清时期，南京是中国古典小说、戏曲创作和出版的中心，《桃花扇》《红楼梦》《儒林外史》等皆与南京密切相关，也留下许多描绘市井风貌的经典场景。

第九站：山水文城
“山水含清晖。清晖能娱人。”描绘南京秀丽山川的诗文历朝历代都不胜枚举，南京也是中国山水诗派的发源地。

第十站：豁蒙楼
豁蒙楼是晚清名臣张之洞为纪念戊戌六君子之一杨锐而建，后成为文人雅集胜地，留有豁蒙楼联句、重阳诗会等文坛佳话。

底站：诗国南京`;

const menuRect = wx.getMenuButtonBoundingClientRect();
const top = uni.upx2px(564 - 32 - 16) - menuRect.bottom;
const opacity = ref(0);
onPageScroll((event) => {
  const { scrollTop } = event;
  opacity.value = scrollTop / top;
});
</script>

<style lang="scss" src="./index.scss"></style>
